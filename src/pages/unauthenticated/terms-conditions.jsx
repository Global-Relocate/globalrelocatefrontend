import MainLayout from "@/components/layouts/MainLayout";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="flex justify-center items-center pt-[150px] pb-0">
        <div className="w-[80%]" style={{ color: "black" }}>
          <h1 className="font-bold text-[30px]">
            {t("landingPage.termsOfService.title")}
          </h1>

          <p className="my-5">{t("landingPage.termsOfService.paragraph")}</p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.platformUse")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.platformUse_1")}
          </p>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.platformUse_2")}
          </p>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.platformUse_3")}
          </p>

          <ul className="list-disc pl-5 my-5">
            <li>{t("landingPage.termsOfService.sections.prohibited_1")}</li>
            <li>{t("landingPage.termsOfService.sections.prohibited_2")}</li>
            <li>{t("landingPage.termsOfService.sections.prohibited_3")}</li>
            <li>{t("landingPage.termsOfService.sections.prohibited_4")}</li>
          </ul>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.intellectualProperty")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.intellectualProperty_1")}
          </p>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.intellectualProperty_2")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.disclaimer")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.disclaimer_1")}
          </p>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.disclaimer_2")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.liability")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.liability_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.thirdParty")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.thirdParty_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.modifications")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.modifications_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.governingLaw")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.governingLaw_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.entireAgreement")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.entireAgreement_1")}
          </p>

          <h3 className="font-bold text-[18px]">
            {t("landingPage.termsOfService.sections.whyChoose")}
          </h3>
          <p className="my-5">
            {t("landingPage.termsOfService.sections.whyChoose_1")}
          </p>
          <ul className="list-disc pl-5 my-5">
            <li>
              <strong>
                {
                  t(
                    "landingPage.termsOfService.sections.whyChoose_bullet1"
                  ).split(":")[0]
                }
                :
              </strong>{" "}
              {
                t(
                  "landingPage.termsOfService.sections.whyChoose_bullet1"
                ).split(":")[1]
              }
            </li>
            <li>
              <strong>
                {
                  t(
                    "landingPage.termsOfService.sections.whyChoose_bullet2"
                  ).split(":")[0]
                }
                :
              </strong>{" "}
              {
                t(
                  "landingPage.termsOfService.sections.whyChoose_bullet2"
                ).split(":")[1]
              }
            </li>
            <li>
              <strong>
                {
                  t(
                    "landingPage.termsOfService.sections.whyChoose_bullet3"
                  ).split(":")[0]
                }
                :
              </strong>{" "}
              {
                t(
                  "landingPage.termsOfService.sections.whyChoose_bullet3"
                ).split(":")[1]
              }
            </li>
            <li>
              <strong>
                {
                  t(
                    "landingPage.termsOfService.sections.whyChoose_bullet4"
                  ).split(":")[0]
                }
                :
              </strong>{" "}
              {
                t(
                  "landingPage.termsOfService.sections.whyChoose_bullet4"
                ).split(":")[1]
              }
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsAndConditions;
