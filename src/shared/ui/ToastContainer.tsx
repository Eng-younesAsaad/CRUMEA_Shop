import React from "react";
import { useToast } from "../context/ToastContext";
import { Toast } from "./Toast";

export interface ToastContainerProps {
  id?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ id = "toasts" }) => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return <div id={id} className="toasts-container" aria-live="polite" aria-atomic="true" />;
  }

  return (
    <div id={id} className="toasts-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};
