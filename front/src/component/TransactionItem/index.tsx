import React from "react";
import "./index.css";
import PaymentSystemStripeSvg from "../../images/paymentSystem-stripe.svg";
import PaymentSystemCoinbaseSvg from "../../images/paymentSystem-coinbase.svg";
import SenderSvg from "../../images/sender.svg";

interface TransactionItemProps {
  id: number;
  type: "receive" | "send";
  amount: number;
  date: string;
  paymentSystem: string;
  onClick: (id: number) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  id,
  type,
  amount,
  date,
  paymentSystem,
  onClick,
}) => {
  const amountStyle = type === "receive" ? "positive" : "negative";

  const formatTime = (date: string): string => {
    const time = new Date(date);
    return `${time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const getPaymentSystemIcon = (paymentSystem: string): string => {
    if (paymentSystem === "Stripe") {
      return PaymentSystemStripeSvg;
    } else if (paymentSystem === "Coinbase") {
      return PaymentSystemCoinbaseSvg;
    }
    return SenderSvg;
  };

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(amount));

  const [wholePart, fractionalPart] = formattedAmount.split(".");

  const handleClick = () => {
    console.log("Transaction Item Clicked, ID:", id);
    onClick(id);
  };

  return (
    <div className="transaction-item" onClick={handleClick}>
      <div className="transaction-item__info">
        <img
          className="transaction-item__payment"
          src={getPaymentSystemIcon(paymentSystem)}
          alt={paymentSystem}
        />

        <div className="transaction-item__description">
          <h1 className="transaction-item__title">{paymentSystem}</h1>

          <div className="transaction-item__sub-block">
            <span className="transaction-item__sub-value">
              {formatTime(date)}
            </span>
            <span className="transaction-item__sub-value">
              {type === "receive" ? "Receipt" : "Sending"}
            </span>
          </div>
        </div>
      </div>
      <div className={`transaction-item__amount ${amountStyle}`}>
        {type === "receive" ? (
          <span>
            <strong className="transaction-item__whole">+{wholePart}</strong>.
            {fractionalPart}
          </span>
        ) : (
          <span>
            <strong className="transaction-item__whole">-{wholePart}</strong>.
            {fractionalPart}
          </span>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
