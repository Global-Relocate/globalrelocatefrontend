import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

export function CookieConsentModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // Check localStorage to see if user has already consented
  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    if (!storedConsent) {
      setTimeout(() => setOpen(true), 1000); // show after a short delay
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = { necessary: true, analytics: true, marketing: true };
    setConsent(allConsent);
    localStorage.setItem("cookieConsent", JSON.stringify(allConsent));
    setOpen(false);
  };

  const handleSave = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setOpen(false);
  };

  const handleReject = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setConsent(minimalConsent);
    localStorage.setItem("cookieConsent", JSON.stringify(minimalConsent));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl rounded-2xl px-6">
        <DialogHeader>
          <DialogTitle className="text-left">
            {t("cookieConsentModal.title")}
          </DialogTitle>
          <DialogDescription className="break-words text-left">
            {t("cookieConsentModal.description", {
              privacyPolicy: t("cookieConsentModal.privacyPolicy"),
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="font-medium">
              {t("cookieConsentModal.necessaryCookies")}
            </label>
            <Switch checked disabled />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("cookieConsentModal.necessaryCookiesMessage")}
          </p>

          <div className="flex justify-between items-center">
            <label className="font-medium">
              {t("cookieConsentModal.analyticsCookies")}
            </label>
            <Switch
              checked={consent.analytics}
              onCheckedChange={(checked) =>
                setConsent({ ...consent, analytics: checked })
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("cookieConsentModal.analyticsCookiesMessage")}
          </p>

          <div className="flex justify-between items-center">
            <label className="font-medium">
              {t("cookieConsentModal.marketingCookies")}
            </label>
            <Switch
              checked={consent.marketing}
              onCheckedChange={(checked) =>
                setConsent({ ...consent, marketing: checked })
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("cookieConsentModal.marketingCookiesMessage")}
          </p>
        </div>

        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleReject}>
            {t("cookieConsentModal.rejectAll")}
          </Button>
          <Button variant="secondary" onClick={handleSave}>
            {t("cookieConsentModal.savePreferences")}
          </Button>
          <Button onClick={handleAcceptAll}>
            {t("cookieConsentModal.acceptAll")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
