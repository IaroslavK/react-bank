import React from "react";
import "./index.css";

interface BalanceProps {
  value: number;
}

const Balance: React.FC<BalanceProps> = ({ value }) => {
  const dollars = Math.floor(value);
  const cents = Math.round((value - dollars) * 100);

  return (
    <div className="balance">
      <span className="balance-dollars">${dollars}</span>
      <span className="balance-cents">.{cents < 10 ? `0${cents}` : cents}</span>
    </div>
  );
};

export default Balance;
