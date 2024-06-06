import "./index.css";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../component/Header";
import InputField from "../../component/InputField";
import ReceiveButton from "../../component/ReceiveButton";
import PaymentSystemStripeSvg from "../../images/paymentSystem-stripe.svg";
import PaymentSystemCoinbaseSvg from "../../images/paymentSystem-coinbase.svg";
import PaymentTypesStripeSvg from "../../images/paymentTypes-stripe.svg";
import PaymentTypesCoinbaseSvg from "../../images/paymentTypes-coinbase.svg";
import Divider from "../../component/Divider";
import Title from "../../component/Title";
import Alert from "../../component/Alert";
import { useNavigate } from "react-router-dom";

const Receive: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleReciev = async (paymentSystem: string) => {
    if (!authContext?.state?.token) {
      setError("Не авторизован");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/receive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.state.token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount), paymentSystem }),
      });

      if (response.ok) {
        // const data = await response.json();

        navigate("/balance");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Произошла неизвестная ошибка");
      }
    }
  };

  return (
    <div className="receive">
      <Header title="Receive" />

      <div className="receive-form">
        <div className="receive-input">
          <Title>Receive amount</Title>
          <InputField
            type="number"
            value={amount}
            onChange={handleInputChange}
            placeholder="Введите сумму"
            payment
          />
        </div>

        <Divider />

        <div className="receive-buttons">
          <Title>Payment system</Title>
          <ReceiveButton
            label="Stripe"
            onClick={() => handleReciev("Stripe")}
            svg1={PaymentSystemStripeSvg}
            alt1="Payment system Stripe"
            svg2={PaymentTypesStripeSvg}
            alt2="Payment types Stripe"
          />
          <ReceiveButton
            label="Coinbase"
            onClick={() => handleReciev("Coinbase")}
            svg1={PaymentSystemCoinbaseSvg}
            alt1="Payment System Coinbase"
            svg2={PaymentTypesCoinbaseSvg}
            alt2="Payment types Coinbase"
          />
        </div>
      </div>
      {error && <Alert message={error} />}
    </div>
  );
};

export default Receive;
