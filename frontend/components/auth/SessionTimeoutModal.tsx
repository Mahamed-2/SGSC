"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

interface SessionTimeoutModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  onContinue: () => void;
  onLogout: () => void;
}

export function SessionTimeoutModal({
  isOpen,
  remainingSeconds,
  onContinue,
  onLogout,
}: SessionTimeoutModalProps) {
  const t = useTranslations("auth");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onLogout()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("sessionTimeoutTitle", { defaultMessage: "Session Expiring" })}</DialogTitle>
          <DialogDescription>
            {t("sessionTimeoutDesc", {
              defaultMessage: "Your session will expire in {seconds} seconds due to inactivity.",
              seconds: remainingSeconds,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={onLogout}>
            {t("signOut", { defaultMessage: "Sign Out" })}
          </Button>
          <Button onClick={onContinue}>
            {t("continueSession", { defaultMessage: "Continue Session" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
