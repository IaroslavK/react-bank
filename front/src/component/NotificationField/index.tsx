import "./index.css";
import AnnouncementIcon from "../../images/announcement-icon.svg";
import WarningIcon from "../../images/warning-icon.svg";
import PaymentIcon from "../../images/payment-icon copy.svg";
import SendSvg from "../../images/sender.svg";

interface NotificationFieldProps {
  type: string;
  message: string;
  timestamp: string;
  paymentSystem?: string;
}

const NotificationField: React.FC<NotificationFieldProps> = ({
  type,
  message,
  timestamp,
  paymentSystem,
}) => {
  const formatTimeElapsed = (timestamp: string): string => {
    const createdTime = new Date(timestamp).getTime();
    const currentTime = new Date().getTime();
    const elapsedMs = currentTime - createdTime;
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

    if (elapsedMinutes < 60) {
      return `${elapsedMinutes} min. ago`;
    } else {
      const elapsedHours = Math.floor(elapsedMinutes / 60);
      return `${elapsedHours} hour${elapsedHours !== 1 ? "s" : ""} ago`;
    }
  };
  console.log(paymentSystem);

  const getIcon = (type: string): string => {
    if (type === "Announcement") {
      return AnnouncementIcon;
    } else if (type === "Warning") {
      return WarningIcon;
    } else if (type === "Payment") {
      return PaymentIcon;
    } else if (type === "Send") {
      return SendSvg;
    }
    return "";
  };

  return (
    <div className="notification-field">
      <img src={getIcon(type)} alt={type} />

      <div className="notification-field__description">
        <h1 className="notification-field__title">{message}</h1>
        <div className="notification-field__sub-block">
          <span className="notification-field__sub-value">
            {formatTimeElapsed(timestamp)}
          </span>
          <span className="notification-field__sub-value">{type}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationField;
