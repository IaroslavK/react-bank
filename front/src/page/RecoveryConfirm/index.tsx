import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../component/BackButton";
import Heading from "../../component/Heading";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Alert from "../../component/Alert";

const RecoveryConfirm = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirmRecovery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !password) {
      setError("Помилка. Обов'язкові поля відсутні");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/recovery-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, password }),
      });

      if (response.ok) {
        navigate("/signin");
      } else {
        const data = await response.json();
        setError(
          data.message || "Ошибка подтверждения восстановления аккаунта"
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(
          error.message || "Ошибка подтверждения восстановления аккаунта"
        );
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  return (
    <div className="recovery">
      <BackButton />
      <Heading title="Recover password" text="Write the code you received" />
      <form className="recovery__form" onSubmit={handleConfirmRecovery}>
        <InputField
          label="Code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <InputField
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          label="Restore password"
          type="submit"
          primary
          disabled={code.length === 0 || password.length === 0}
        />
        {error && <Alert message={error} />}
      </form>
    </div>
  );
};

export default RecoveryConfirm;
