import React, { useEffect, useState, useCallback } from "react";
import type { ToastItem } from "../context/ToastContext";

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function getToastIcon(type: string): string {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✕";
    default:
      return "ℹ";
  }
}

function getToastRole(type: string): "alert" | "status" {
  if (type === "error") {
    return "alert";
  }
  return "status";
}

function getToastClassNames(type: string, isVisible: boolean, isLeaving: boolean): string {
  const classes = ["toast", `toast--${type}`];
  if (isVisible) {
    classes.push("is-visible");
  }
  if (isLeaving) {
    classes.push("is-leaving");
  }
  return classes.join(" ");
}

export function Toast({ toast, onDismiss }: ToastProps): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const triggerDismiss = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 250);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const dismissTimer = setTimeout(() => {
      triggerDismiss();
    }, 3500);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(dismissTimer);
    };
  }, [triggerDismiss]);

  const iconGlyph = getToastIcon(toast.type);
  const role = getToastRole(toast.type);
  const classNames = getToastClassNames(toast.type, isVisible, isLeaving);

  return (
    <div className={classNames} role={role}>
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
}
