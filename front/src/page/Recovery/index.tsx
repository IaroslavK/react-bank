import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../component/BackButton";
import Heading from "../../component/Heading";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Alert from "../../component/Alert";

const AccountRecovery = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAccountRecovery = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        navigate("/recovery-confirm");
      } else {
        const data = await response.json();
        setError(data.message || "Ошибка восстановления аккаунта");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Ошибка восстановления аккаунта");
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  return (
    <div className="recovery">
      <BackButton />
      <Heading title="Recover password" text="Choose a recovery method" />
      <form className="recovery__form" onSubmit={handleAccountRecovery}>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          label="Send code"
          type="submit"
          primary
          disabled={email.length === 0}
        />
        {error && <Alert message={error} />}
      </form>
    </div>
  );
};

export default AccountRecovery;
