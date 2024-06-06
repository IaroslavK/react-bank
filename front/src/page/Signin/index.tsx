import "./index.css";
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../../component/BackButton";
import Heading from "../../component/Heading";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Alert from "../../component/Alert";

const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        authContext?.dispatch({
          type: "LOGIN",
          payload: {
            token: data.token,
            email: data.email,
            userConfirm: data.userConfirm,
          },
        });

        if (data.userConfirm) {
          console.log("User confirmed, redirecting to /balance");
          navigate("/balance");
        } else {
          console.log("User not confirmed, redirecting to /signup-confirm");
          navigate("/signup-confirm");
        }
      } else {
        setError(data.message || "Ошибка входа");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Ошибка входа");
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <div className="signin">
      <BackButton />
      <Heading title="Sign in" text="Select login method" />
      <form className="signin__form" onSubmit={handleSignin}>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="recoveryLink">
          Forgot your password?{" "}
          <Link style={{ color: "#775CE5" }} to="/recovery">
            Restore
          </Link>
        </p>
        <Button
          label="Continue"
          type="submit"
          primary
          disabled={!isFormValid}
        />
        {error && <Alert message={error} />}
      </form>
    </div>
  );
};

export default SigninPage;
