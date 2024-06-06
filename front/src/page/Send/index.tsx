import "./index.css";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../component/Header";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Alert from "../../component/Alert";
import Success from "../../component/Success";

const Send: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSendMoney = async () => {
    try {
      if (!authContext?.state?.token) {
        throw new Error("Не авторизован");
      }

      const numericAmount = parseFloat(amount);

      const response = await fetch("http://localhost:4000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.state.token}`,
        },
        body: JSON.stringify({ email, amount: numericAmount }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке денег");
      }

      // const data = await response.json();
      setSuccess("Деньги успешно отправлены");
      setTimeout(() => {
        navigate("/balance");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="send-page">
      <Header title="Send" />
      <InputField
        label="Email"
        type="email"
        placeholder="Email получателя"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Sum"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Введите сумму"
        payment
      />

      <Button label="Send" onClick={handleSendMoney} primary>
        Отправить
      </Button>
      {error && <Alert>{error}</Alert>}
      {success && <Success>{success}</Success>}
    </div>
  );
};

export default Send;
