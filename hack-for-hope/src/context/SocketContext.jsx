import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io server
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      // Authenticate socket with user ID
      newSocket.emit("authenticate", user.id || user._id);

      // Join village room if user has a village
      if (user.village) {
        newSocket.emit("join-village", user.village);
        console.log(`Joined village room: ${user.village}`);
      }

      // Join role room
      if (user.role) {
        newSocket.emit("join-role", user.role);
        console.log(`Joined role room: ${user.role}`);
      }
    });

    // Listen for notifications
    newSocket.on("notification", (notification) => {
      console.log("✅ New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show browser notification if permitted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/sos-logo.png",
        });
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting socket");
      newSocket.close();
    };
  }, [user]);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
