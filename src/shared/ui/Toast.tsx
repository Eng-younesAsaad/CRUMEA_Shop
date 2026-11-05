import React, { useEffect, useState, useCallback } from "react";
import type { ToastItem } from "../context/ToastContext";

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const triggerDismiss = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 250);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    // Animate in
    const enterFrame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto dismiss after 3.5 seconds
    const dismissTimer = setTimeout(() => {
      triggerDismiss();
    }, 3500);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(dismissTimer);
    };
  }, [triggerDismiss]);

  const iconGlyph = toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ";

  const classNames = [
    "toast",
    `toast--${toast.type}`,
    isVisible ? "is-visible" : "",
    isLeaving ? "is-leaving" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} role={toast.type === "error" ? "alert" : "status"}>
      <span className="toast__icon" aria-hidden="true">
        {iconGlyph}
      </span>
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        aria-label="Close notification"
        onClick={triggerDismiss}
      >
        &times;
      </button>
    </div>
  );
};
