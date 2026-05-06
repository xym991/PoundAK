import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NotificationType = "info" | "error" | "warning";

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

type NotificationContextType = {
  notify: (message: string, type: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notifications?.length > 0 && (
        <div
          className="absolute top-[80px] right-[425px] flex flex-col gap-2"
          style={{ zIndex: 9999 }}
        >
          <AnimatePresence>
            {notifications.map(({ id, message, type }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className={`shadow-[4px 4px 12px var(--red)] p-3 flex items-center gap-3 text-white  font-normal
                ${type === "error" ? "bg-[var(--red)]" : type === "warning" ? "bg-yellow-500" : "bg-[#202020]"}`}
                style={{ border: "1px solid #454545" }}
              >
                <span>{message}</span>
                <button
                  onClick={() => removeNotification(id)}
                  className="ml-auto text-lg font-bold"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
