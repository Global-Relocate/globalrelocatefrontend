"use client";

import { CookieModal } from "@schlomoh/react-cookieconsent";
import { useTranslation } from "react-i18next";

const MyCookieModal = () => {
  const { t } = useTranslation();

  const Content = () => (
    <>
      <h3 className="text-lg font-semibold">{t("cookieConsentModal.title")}</h3>
      <p className="text-md">{t("cookieConsentModal.description")}</p>
    </>
  );

  const MContent = () => (
    <>
      <h3 className="text-lg font-semibold">
        {t("cookieConsentModal.manageTitle")}
      </h3>
      <p className="text-md">{t("cookieConsentModal.manageMessage")}</p>
    </>
  );

  return (
    <CookieModal
      acceptButtonText={t("cookieConsentModal.accept")}
      declineButtonText={t("cookieConsentModal.decline")}
      headingColor="black"
      paragraphColor="grey"
      primaryButtonStyle={{ backgroundColor: "#FCA311" }}
      infoContent={<Content />}
      enableManagement
      managementContent={<MContent />}
      managementButtonText={t("cookieConsentModal.managePreferences")}
      cookieCategories={[
        t("cookieConsentModal.analytics"),
        t("cookieConsentModal.advertisment"),
      ]}
    />
  );
};

export default MyCookieModal;
