import "./index.css";
import React, { useState, useEffect, useContext } from "react";
import Header from "../../component/Header";
import Balance from "../../component/Balance";
import RoundButton from "../../component/RoundButton";
import ReceiveSvg from "../../images/receive.svg";
import SendSvg from "../../images/send.svg";
import { AuthContext } from "../../context/AuthContext";
import TransactionItem from "../../component/TransactionItem";
import { useNavigate } from "react-router-dom";
import Alert from "../../component/Alert";

interface Transaction {
  transactionId: number;
  type: "receive" | "send";
  amount: number;
  date: string;
  paymentSystem: string;
}

const BalancePage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [balance, setBalance] = useState<number | null | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authContext?.state?.token) {
          throw new Error("Не авторизован");
        }

        const balanceResponse = await fetch("http://localhost:4000/balance", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authContext.state.token}`,
          },
        });

        if (!balanceResponse.ok) {
          throw new Error("Ошибка при загрузке баланса");
        }

        const balanceData = await balanceResponse.json();
        setBalance(balanceData.balance);

        const transactionsResponse = await fetch(
          "http://localhost:4000/transactions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authContext.state.token}`,
            },
          }
        );

        if (!transactionsResponse.ok) {
          throw new Error("Ошибка при загрузке транзакций");
        }

        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.transactions);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [authContext?.state?.token]);

  const handleTransactionClick = (id: number) => {
    if (isNaN(id)) {
      console.error("Некорректный ID транзакции:", id);
      return;
    }
    console.log("Transaction ID clicked:", id);
    navigate(`/transaction/${id}`);
  };

  return (
    <div className="balance-page">
      <Header title="Main wallet" balancePage />
      {balance !== null && balance !== undefined ? (
        <Balance value={balance} />
      ) : (
        <div className="balance-loader">Загрузка...</div>
      )}

      <div className="balance-buttons">
        <RoundButton
          label="Receive"
          to="/receive"
          svg={ReceiveSvg}
          alt="receive"
        />
        <RoundButton label="Send" to="/send" svg={SendSvg} alt="send" />
      </div>
      <div className="transactions">
        {transactions
          .map((transaction) => (
            <TransactionItem
              key={transaction.transactionId}
              id={transaction.transactionId}
              type={transaction.type}
              amount={transaction.amount}
              date={transaction.date}
              onClick={() => handleTransactionClick(transaction.transactionId)}
              paymentSystem={transaction.paymentSystem}
            />
          ))
          .reverse()}
      </div>
      {error && <Alert>{error}</Alert>}
    </div>
  );
};

export default BalancePage;
