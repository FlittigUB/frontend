// NotificationsList.tsx
import React from "react";
import Notification from "./Notification";
import { useNotifications } from "@/context/NotificationsContext";

export default function NotificationsList() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-[999] flex flex-col gap-2">
      {notifications.map((n) => (
        <Notification
          key={n.id}
          {...n}
          onClose={(id) => removeNotification(id)}
        />
      ))}
    </div>
  );
}
