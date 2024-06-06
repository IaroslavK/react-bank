import React from "react";
import "./index.css";

interface ReceiveButtonProps {
  label: string;
  onClick: () => void;
  svg1: string;
  svg2: string;
  alt1: string;
  alt2: string;
}

const ReceiveButton: React.FC<ReceiveButtonProps> = ({
  label,
  onClick,
  svg1,
  svg2,
  alt1,
  alt2,
}) => {
  return (
    <button className="receive-button" onClick={onClick}>
      <div className="receive-label">
        <img src={svg1} alt={alt1} />
        <span className="receive-text">{label}</span>
      </div>
      <img src={svg2} alt={alt2} />
    </button>
  );
};

export default ReceiveButton;
