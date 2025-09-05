import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CircleFlag } from "react-circle-flags";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageLoader from "@/components/loaders/PageLoader";
import { getCountryName } from "@/data/country-translations";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

const baseURL = import.meta.env.VITE_API_URL;

export default function VisaRequirements() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [visaRequirements, setVisaRequirements] = useState(null);

  const fetchRequirements = async () => {
    setLoading(true);
    // Fetch visa requirements based on the country slug
    try {
      const response = await axios.get(
        `https://api.henleypassportindex.com/api/v3/visa-single/${slug.toUpperCase()}`
      );
      setVisaRequirements(response.data);
    } catch (err) {
      setVisaRequirements(null);
      console.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (!visaRequirements)
    return (
      <DashboardLayout>
        <section className="min-h-screen">
          <p>No data found for the specified country.</p>
        </section>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          to="/visa-index"
          className="hover:underline flex items-center gap-x-2"
        >
          <ArrowLeft className="w-5 h-5" />{" "}
          {t("userDashboard.visaIndex.backToVisaIndex")}
        </Link>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-y-6 gap-x-10 items-center">
        <div className="rounded-lg h-[341px] w-[230px] mx-auto">
          <img
            src={`${baseURL}/image/fetch/${slug?.toLowerCase()}`}
            alt={slug}
            className="w-full h-full"
          />
        </div>
        <div className="w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {getCountryName(visaRequirements?.code, selectedLanguage.code)}{" "}
            {t("userDashboard.visaRequirements.title")} (2025)
          </h1>
          <p>
            {getCountryName(visaRequirements?.code, selectedLanguage.code)}{" "}
            {t("userDashboard.visaRequirements.visaFree.desc1")}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {t("userDashboard.visaRequirements.visaFree.desc2")}{" "}
          {getCountryName(visaRequirements?.code, selectedLanguage.code)}{" "}
          {t("userDashboard.visaRequirements.visaFree.desc3")}
        </h1>
        <p>
          {t("userDashboard.visaRequirements.visaFree.desc4")}{" "}
          {visaRequirements?.visa_free_access?.length}{" "}
          {t("userDashboard.visaRequirements.visaFree.desc5")}{" "}
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.visa_free_access?.map((country, index) => (
              <div key={index} className="flex items-center gap-x-4">
                {" "}
                <CircleFlag
                  countryCode={country.code.toLowerCase()}
                  height={20}
                  width={25}
                />
                {getCountryName(country.code, selectedLanguage.code)}
              </div>
            ))}
          </div>

          <p className="my-6">
            {t("userDashboard.visaRequirements.visaFree.desc6", {
              country: getCountryName(
                visaRequirements?.code,
                selectedLanguage.code
              ),
            })}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {t("userDashboard.visaRequirements.visaOnArrival.title", {
            country: getCountryName(
              visaRequirements?.code,
              selectedLanguage.code
            ),
          })}{" "}
        </h1>
        <p>
          {t("userDashboard.visaRequirements.visaOnArrival.desc1", {
            country: getCountryName(
              visaRequirements?.code,
              selectedLanguage.code
            ),
            count: visaRequirements?.visa_on_arrival?.length,
          })}
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.visa_on_arrival?.map((country, index) => (
              <div key={index} className="flex items-center gap-x-4">
                {" "}
                <CircleFlag
                  countryCode={country.code.toLowerCase()}
                  height={20}
                  width={25}
                />
                {getCountryName(country.code, selectedLanguage.code)}
              </div>
            ))}
          </div>

          <p className="my-6">
            {t("userDashboard.visaRequirements.visaOnArrival.desc2")}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {t("userDashboard.visaRequirements.eTA.title", {
            country: getCountryName(
              visaRequirements?.code,
              selectedLanguage.code
            ),
          })}
        </h1>
        <p>
          {t("userDashboard.visaRequirements.eTA.desc1", {
            country: getCountryName(
              visaRequirements?.code,
              selectedLanguage.code
            ),
            count: visaRequirements?.electronic_travel_authorisation?.length,
          })}
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.electronic_travel_authorisation?.map(
              (country, index) => (
                <div key={index} className="flex items-center gap-x-4">
                  <CircleFlag
                    countryCode={country.code.toLowerCase()}
                    height={20}
                    width={25}
                  />
                  {getCountryName(country.code, selectedLanguage.code)}
                </div>
              )
            )}
          </div>

          <p className="my-6">
            {t("userDashboard.visaRequirements.eTA.desc2")}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {t("userDashboard.visaRequirements.eVisa.title", {
            country: getCountryName(
              visaRequirements?.code,
              selectedLanguage.code
            ),
          })}
        </h1>
        <p>
          {t("userDashboard.visaRequirements.eVisa.desc1", {
            country: getCountryName(
              visaRequirements?.code,
              selectedLanguage.code
            ),
            count: visaRequirements?.visa_online?.length,
          })}
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.visa_online?.map((country, index) => (
              <div key={index} className="flex items-center gap-x-4">
                {" "}
                <CircleFlag
                  countryCode={country.code.toLowerCase()}
                  height={20}
                  width={25}
                />
                {getCountryName(country.code, selectedLanguage.code)}
              </div>
            ))}
          </div>

          <p className="my-6">
            {t("userDashboard.visaRequirements.eVisa.desc2")}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {t("userDashboard.visaRequirements.visaRequired.title", {
            country: getCountryName(
              visaRequirements?.code,
              selectedLanguage.code
            ),
          })}
        </h1>
        <p>
          {t("userDashboard.visaRequirements.visaRequired.desc1", {
            country: getCountryName(
              visaRequirements?.code,
              selectedLanguage.code
            ),
            count: visaRequirements?.visa_required?.length,
          })}
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.visa_required?.map((country, index) => (
              <div key={index} className="flex items-center gap-x-4">
                {" "}
                <CircleFlag
                  countryCode={country.code.toLowerCase()}
                  height={20}
                  width={25}
                />
                {getCountryName(country.code, selectedLanguage.code)}
              </div>
            ))}
          </div>

          <p className="my-6">
            {t("userDashboard.visaRequirements.visaRequired.desc2")}
          </p>

          <p className="my-6">
            {t("userDashboard.visaRequirements.visaRequired.desc3")}
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}
