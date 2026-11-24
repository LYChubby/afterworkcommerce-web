"use client";

import * as React from "react";

import { NotificationDialog } from "@/components/ui/notification-dialog";

type NotificationType = "confirmation" | "success" | "error" | "info" | "warning";

type SimpleNotificationType = Exclude<NotificationType, "confirmation">;

interface NotificationOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
}

interface ConfirmationOptions extends NotificationOptions {
  confirmLabel?: string;
  cancelLabel?: string;
}

interface NotificationState extends NotificationOptions {
  type: NotificationType;
  cancelLabel?: string;
  showCancel: boolean;
}

interface NotificationContextValue {
  notify: (type: SimpleNotificationType, options: NotificationOptions) => void;
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const NotificationContext = React.createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = React.useState<NotificationState | null>(null);

  const confirmationResolver = React.useRef<((confirmed: boolean) => void) | null>(null);

  const finishNotification = React.useCallback((confirmed: boolean) => {
    setNotification(null);

    const resolver = confirmationResolver.current;
    confirmationResolver.current = null;

    resolver?.(confirmed);
  }, []);

  const notify = React.useCallback(
    (type: SimpleNotificationType, options: NotificationOptions) => {
      finishNotification(false);

      setNotification({
        ...options,
        type,
        showCancel: false,
      });
    },
    [finishNotification],
  );

  const confirm = React.useCallback(
    (options: ConfirmationOptions): Promise<boolean> => {
      finishNotification(false);

      return new Promise<boolean>((resolve) => {
        confirmationResolver.current = resolve;

        setNotification({
          ...options,
          type: "confirmation",
          showCancel: true,
          confirmLabel: options.confirmLabel ?? "Ya, lanjutkan",
          cancelLabel: options.cancelLabel ?? "Batal",
        });
      });
    },
    [finishNotification],
  );

  const contextValue = React.useMemo(
    () => ({
      notify,
      confirm,
    }),
    [notify, confirm],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      <NotificationDialog
        open={notification !== null}
        type={notification?.type ?? "info"}
        title={notification?.title ?? ""}
        description={notification?.description}
        confirmLabel={notification?.confirmLabel ?? "Mengerti"}
        cancelLabel={notification?.cancelLabel ?? "Batal"}
        showCancel={notification?.showCancel ?? false}
        onConfirm={() => finishNotification(true)}
        onClose={() => finishNotification(false)}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = React.useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification harus digunakan di dalam NotificationProvider.");
  }

  return context;
}
