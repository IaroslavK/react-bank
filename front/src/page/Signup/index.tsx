import "./index.css";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Heading from "../../component/Heading";
import BackButton from "../../component/BackButton";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Alert from "../../component/Alert";
import { Link } from "react-router-dom";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      if (authContext) {
        authContext.dispatch({
          type: "LOGIN",
          payload: {
            token: data.session.token,
            email: data.email,
            userConfirm: data.userConfirm,
          },
        });
      }
      navigate("/signup-confirm");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <div className="signup">
      <BackButton />
      <Heading title="Sign up" text="Choose a registration method" />
      <form className="signup__form" onSubmit={handleSignup}>
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

        <p className="signinLink">
          Already have an account?{" "}
          <Link style={{ color: "#775CE5" }} to="/signin">
            Sign In
          </Link>
        </p>

        <Button
          label="Continue"
          type="submit"
          primary
          disabled={!isFormValid}
        />

        {error && <Alert>{error}</Alert>}
      </form>
    </div>
  );
};

export default SignupPage;
