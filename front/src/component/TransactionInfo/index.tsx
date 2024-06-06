import React from "react";
import "./index.css";
import Divider from "../Divider";

interface TransactionInfoProps {
  amount: number;
  date: string;
  address: string;
  type: "receive" | "send";
}

const TransactionInfo: React.FC<TransactionInfoProps> = ({
  amount,
  date,
  address,
  type,
}) => {
  const amountStyle = type === "receive" ? "positive" : "negative";
  const formatDate = (dateStr: string): string => {
    const [datePart, timePart] = dateStr.split(", ");
    const [day, month, year] = datePart.split(".");
    const [hours, minutes] = timePart.split(":");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes)
    );

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("en-GB", options);
  };

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(amount));

  const [wholePart, fractionalPart] = formattedAmount.split(".");

  return (
    <div className="transaction-info">
      <div className={`transaction-info__amount ${amountStyle}`}>
        {type === "receive" ? (
          <span>
            <strong className="transaction-info__whole">
              +{wholePart}.{fractionalPart}
            </strong>
          </span>
        ) : (
          <span>
            <strong className="transaction-info__whole">-{wholePart}</strong>.
            {fractionalPart}
          </span>
        )}
      </div>

      <div className="transaction-info__block">
        <div className="transaction-info__value">
          <p>Date</p>
          <p>{formatDate(date)}</p>
        </div>
        <Divider />
        <div className="transaction-info__value">
          <p>Address</p>
          <span className="transaction-item__sub-value">{address}</span>
        </div>
        <Divider />
        <div className="transaction-info__value">
          <p>Type</p>
          <span className="transaction-item__sub-value">
            {type === "receive" ? "Receive" : "Send"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
