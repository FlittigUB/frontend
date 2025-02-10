// NotificationsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { NotificationProps } from "@/components/portal/ui/Notification";

interface NotificationsContextType {
  notifications: NotificationProps[];
  addNotification: (notification: Omit<NotificationProps, "id">) => void;
  removeNotification: (id: string | number) => void;
  fetchNotifications?: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  // Example fetch function, if you want to load from an API
  const fetchNotifications = async () => {
    try {
      //const res = await fetch("/api/notifications");
      // E.g. an endpoint that returns an array of
      // { id, title, description, avatar, timestamp }
      //const data = await res.json();
      //setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Add a new notification (autogenerate an ID or use a library like UUID)
  const addNotification = (notification: Omit<NotificationProps, "id">) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9), // a simple random ID
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  // Remove a notification
  const removeNotification = (id: string | number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Optionally fetch notifications on mount
  useEffect(() => {
    //fetchNotifications();
  }, []);

  const value: NotificationsContextType = {
    notifications,
    addNotification,
    removeNotification,
    fetchNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
