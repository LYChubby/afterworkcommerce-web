"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

type NotificationType = "confirmation" | "success" | "error" | "info" | "warning";

interface NotificationDialogProps {
  open: boolean;
  type: NotificationType;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  isLoading?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}

const notificationConfig = {
  confirmation: {
    icon: AlertCircle,
    iconClassName: "bg-accent/15 text-accent",
    confirmVariant: "default",
  },
  success: {
    icon: CheckCircle2,
    iconClassName: "bg-primary/10 text-primary",
    confirmVariant: "default",
  },
  error: {
    icon: AlertCircle,
    iconClassName: "bg-destructive/10 text-destructive",
    confirmVariant: "destructive",
  },
  info: {
    icon: Info,
    iconClassName: "bg-accent/15 text-accent",
    confirmVariant: "default",
  },
  warning: {
    icon: TriangleAlert,
    iconClassName: "bg-accent/15 text-accent",
    confirmVariant: "default",
  },
} as const;

export function NotificationDialog({ open, type, title, description, confirmLabel = "Mengerti", cancelLabel = "Batal", showCancel = false, isLoading = false, onConfirm, onClose }: NotificationDialogProps) {
  const config = notificationConfig[type];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isLoading) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px]", "data-[state=open]:animate-in data-[state=open]:fade-in-0", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0")} />

        <Dialog.Content
          onEscapeKeyDown={(event) => {
            if (isLoading) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            if (isLoading) {
              event.preventDefault();
            }
          }}
          className={cn(
            "fixed z-50 w-[calc(100%-2rem)] max-w-md",
            "border border-border bg-card p-6 shadow-2xl outline-none",
            "duration-200 ease-out",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "rounded-xl",
            "max-sm:top-auto max-sm:bottom-0 max-sm:left-0",
            "max-sm:w-full max-sm:max-w-none",
            "max-sm:translate-x-0 max-sm:translate-y-0",
            "max-sm:rounded-t-2xl max-sm:rounded-b-none",
            "max-sm:px-5 max-sm:pt-5",
            "max-sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]",
            "max-sm:data-[state=open]:slide-in-from-bottom",
            "max-sm:data-[state=closed]:slide-out-to-bottom",
          )}
        >
          <div className="absolute right-4 top-4">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isLoading}
                aria-label="Tutup notifikasi"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className={cn("mb-4 flex size-12 items-center justify-center rounded-full", config.iconClassName)}>
              <Icon className="size-6" />
            </div>

            <Dialog.Title className="text-base font-semibold tracking-wide text-foreground">{title}</Dialog.Title>

            {description && <Dialog.Description className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</Dialog.Description>}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            {showCancel && (
              <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isLoading} onClick={onClose}>
                {cancelLabel}
              </Button>
            )}

            <Button type="button" variant={config.confirmVariant} className="w-full sm:w-auto" disabled={isLoading} onClick={handleConfirm}>
              {isLoading ? "Memproses..." : confirmLabel}
            </Button>
          </div>

          <Dialog.Description className="sr-only">Notifikasi {type}</Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
