import "./index.css";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../component/Header";
import TransactionInfo from "../../component/TransactionInfo";

interface Transaction {
  id: number;
  userId: number;
  type: "receive" | "send";
  amount: number;
  paymentSystem: string;
  date: string;
}

const TransactionDetailPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [userEmail, setUserEmail] = useState<string>("Unknown");
  const [loading, setLoading] = useState<boolean>(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (authContext?.state?.token) {
        try {
          const response = await fetch(
            `http://localhost:4000/transaction/${Number(transactionId)}`,
            {
              headers: {
                Authorization: `Bearer ${authContext.state.token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setTransaction(data.transaction);
            setUserEmail(data.userEmail);
          } else {
            console.error("Failed to fetch transaction details");
          }
        } catch (error) {
          console.error("Error fetching transaction details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransaction();
  }, [transactionId, authContext?.state?.token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  return (
    <div className="transaction-page">
      <Header title="Transaction" />
      <TransactionInfo
        amount={transaction.amount}
        date={new Date(transaction.date).toLocaleString()}
        address={userEmail}
        type={transaction.type}
      />
    </div>
  );
};

export default TransactionDetailPage;
