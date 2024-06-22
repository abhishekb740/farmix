"use client"
import { useEffect } from "react";

type NotificationProps = {
  message: string;
  show: boolean;
  onClose: () => void; // onClose should be a function that takes no arguments and returns void
};

const Notification: React.FC<NotificationProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
      show ? (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {message}
        </div>
      ) : null
    );
};

export default Notification;
