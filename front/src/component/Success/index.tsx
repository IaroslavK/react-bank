import React from "react";
import "./index.css";
import SuccessImg from "../../images/success.svg";

interface SuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const Success: React.FC<SuccessProps> = ({ message, children, ...props }) => {
  return (
    <div
      className="success"
      {...props}
      style={{ display: "flex", alignItems: "center" }}
    >
      <img src={SuccessImg} alt="Success Icon" style={{ marginRight: "8px" }} />
      {message || children}
    </div>
  );
};

export default Success;
