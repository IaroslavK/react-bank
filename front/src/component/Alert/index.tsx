import React from "react";
import "./index.css";
import AlertImg from "../../images/alert.svg";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const Alert: React.FC<AlertProps> = ({ message, children, ...props }) => {
  return (
    <div
      className="alert"
      {...props}
      style={{ display: "flex", alignItems: "center" }}
    >
      <img src={AlertImg} alt="Error Icon" style={{ marginRight: "8px" }} />
      {message || children}
    </div>
  );
};

export default Alert;
