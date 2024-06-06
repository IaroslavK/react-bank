import "./index.css";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
  to: string;
  svg: string;
  alt: string;
}

const RoundButton: React.FC<ButtonProps> = ({
  label,
  to,
  svg,
  alt,

  ...props
}) => {
  const navigate = useNavigate();

  return (
    <div className="round">
      <button {...props} className="round-button" onClick={() => navigate(to)}>
        <img className="round-img" src={svg} alt={alt} />
      </button>
      <p> {label} </p>
    </div>
  );
};

export default RoundButton;
