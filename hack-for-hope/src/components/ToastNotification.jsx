import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { SOSIcons } from "./SOSIcons";
import "./ToastNotification.css";

function ToastNotification() {
  const { notifications } = useSocket();
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      setVisible(latest);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!visible) return null;

  const getIcon = (type) => {
    switch (type) {
      case "new_report":
      case "report_assigned":
        return SOSIcons.Alert;
      case "report_classified":
        return SOSIcons.Check;
      case "decision_made":
        return SOSIcons.Shield;
      default:
        return SOSIcons.Notification;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "urgent":
        return "toast-urgent";
      case "high":
        return "toast-high";
      default:
        return "toast-normal";
    }
  };

  const Icon = getIcon(visible.type);

  return (
    <div
      className={`toast-notification ${getPriorityClass(visible.priority)} toast-enter`}
    >
      <div className="toast-icon">
        <Icon size={24} />
      </div>
      <div className="toast-content">
        <h4 className="toast-title">{visible.title}</h4>
        <p className="toast-message">{visible.message}</p>
      </div>
      <button className="toast-close" onClick={() => setVisible(null)}>
        ×
      </button>
    </div>
  );
}

export default ToastNotification;
