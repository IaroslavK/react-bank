import "./index.css";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../component/Header";
import Notification from "../../component/Notification";
import NotificationField from "../../component/NotificationField";

interface NotificationType {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

const NotificationsPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (authContext?.state?.token) {
        try {
          const response = await fetch("http://localhost:4000/notifications", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authContext.state.token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications.reverse());
          } else {
            const data = await response.json();
            setError(data.message);
          }
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Произошла неизвестная ошибка");
          }
        }
      } else {
        setError("Не авторизован");
      }
    };

    fetchNotifications();
  }, [authContext?.state?.token]);

  return (
    <div className="notifications-page">
      <Header title="Notifications" />
      {error && <Notification message={error} type="error" />}
      {notifications.length === 0 ? (
        <p>Нет доступных уведомлений</p>
      ) : (
        <div className="notifications">
          {notifications.map((notification) => (
            <NotificationField
              key={notification.id}
              type={notification.type}
              message={notification.message}
              timestamp={notification.timestamp}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
