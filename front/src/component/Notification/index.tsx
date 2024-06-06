import React, { useEffect, useState } from "react";
import Alert from "../../component/Alert";
import Success from "../../component/Success";

interface NotificationProps {
  message: string | undefined;
  type: "error" | "success";
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const [visible, setVisible] = useState<boolean>(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  return type === "error" ? (
    <Alert message={message} />
  ) : (
    <Success message={message} />
  );
};

export default Notification;
