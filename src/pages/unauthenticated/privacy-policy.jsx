import MainLayout from "../../components/layouts/MainLayout";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="flex justify-center items-center py-[150px]">
        <div className="w-[80%]" style={{ color: "black" }}>
          <h1 className="font-bold text-[30px]">
            {t("landingPage.privacyPolicy.title")}
          </h1>

          <p className="my-5">{t("landingPage.privacyPolicy.paragraph")}</p>
          <p className="my-5">{t("landingPage.privacyPolicy.paragraph2")}</p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.informationCollection")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.informationCollection_1")}
          </p>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.informationCollection_2")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.useOfInformation")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.personalInformationUse")}
          </p>

          <ul className="list-disc pl-5 my-5">
            <li>
              {t(
                "landingPage.privacyPolicy.sections.personalInformationUse_bullet1"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.personalInformationUse_bullet2"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.personalInformationUse_bullet3"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.personalInformationUse_bullet4"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.personalInformationUse_bullet5"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.personalInformationUse_bullet6"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.personalInformationUse_bullet7"
              )}
            </li>
          </ul>

          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.usageDataUse")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.informationSharing")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.informationSharing_1")}
          </p>

          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.informationSharing_2")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.cookies")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.cookies_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.dataSecurity")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.dataSecurity_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.thirdPartyLinks")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.thirdPartyLinks_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.childrenPrivacy")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.childrenPrivacy_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.changesToPolicy")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.changesToPolicy_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.whyGlobalRelocate")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.whyGlobalRelocate_1")}
          </p>
          <ul className="list-disc pl-5 my-5">
            <li>
              {t(
                "landingPage.privacyPolicy.sections.whyGlobalRelocate_bullet1"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.whyGlobalRelocate_bullet2"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.whyGlobalRelocate_bullet3"
              )}
            </li>
            <li>
              {t(
                "landingPage.privacyPolicy.sections.whyGlobalRelocate_bullet4"
              )}
            </li>
          </ul>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.privacyPolicy.sections.contactUs")}
          </h3>
          <p className="my-5">
            {t("landingPage.privacyPolicy.sections.contactUs_1")}
          </p>
          <p className="my-5">
            support@globalrelocate.com
            <br />
            GlobalRelocate
            <br />
            [Adddress]
            <br />
            [Country]
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
