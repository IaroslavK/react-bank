import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../../component/BackButton";
import Heading from "../../component/Heading";
import InputField from "../../component/InputField";
import Button from "../../component/Button";
import Alert from "../../component/Alert";

const SignupConfirm = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authContext?.state.user?.userConfirm) {
      navigate("/balance");
    }
  }, [authContext, navigate]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = authContext?.state.token;

      if (!token) {
        throw new Error("Token not found");
      }

      console.log("Code:", code, "Token:", token);

      const response = await fetch("http://localhost:4000/signup-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (authContext) {
        authContext.dispatch({
          type: "CONFIRM_USER",
          payload: {
            userConfirm: true,
          },
        });
      }

      navigate("/balance"); // Redirect to balance page after successful confirmation
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  const isFormValid = code.length > 0;

  return (
    <div className="signup">
      <BackButton />
      <Heading
        title="Confirm Account"
        text="Enter the confirmation code you received"
      />
      <form
        className="signup__form"
        onSubmit={handleConfirm}
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   handleConfirm();
        // }}
      >
        <InputField
          label="Code"
          type="number"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Button label="Confirm" type="submit" primary disabled={!isFormValid} />
        {error && <Alert message={error} />}
      </form>
    </div>
  );
};

export default SignupConfirm;
