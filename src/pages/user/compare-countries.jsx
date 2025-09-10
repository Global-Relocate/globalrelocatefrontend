import { useEffect, useRef, useState } from "react";
import CompareCountryCard from "@/components/cards/CompareCountryCard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SelectCountryModal from "@/components/modals/SelectCountryModal";
import { Button } from "@/components/ui/button";
import { useCountryData } from "@/context/CountryDataContext";
import Spinner from "@/components/loaders/Spinner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

function CompareCountries() {
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [countryData, setCountryData] = useState({});
  const [countryIdx, setCountryIdx] = useState(1);
  const [selectedCountries, setSelectedCountries] = useState([1, 2]);

  const { compareLoader, compareCountries, compareData, resetCompareData } =
    useCountryData();
  const compareViewRef = useRef();
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  const handleModalClose = () => {
    setOpenCountryModal(false);
  };

  const handleModalOpen = (idx) => {
    setOpenCountryModal(true);
    setCountryIdx(idx);
  };

  const handleCountrySelect = (selectedCountryData) => {
    setCountryData((prev) => ({
      ...prev,
      [countryIdx]: selectedCountryData,
    }));
    handleModalClose();
  };

  const handleAddCountry = () => {
    if (selectedCountries.length < 5) {
      const newIndex = Math.max(...selectedCountries) + 1;
      setSelectedCountries([...selectedCountries, newIndex]);
    }
  };

  const handleRemoveCountry = (idx) => {
    if (selectedCountries.length > 2) {
      setSelectedCountries(selectedCountries.filter((i) => i !== idx));
      setCountryData((prev) => {
        const newData = { ...prev };
        delete newData[idx];
        return newData;
      });
    }
  };

  const handleCountryCompare = async () => {
    const countryIds = selectedCountries
      .map((idx) => countryData[idx]?.id)
      .filter(Boolean);

    if (countryIds.length >= 2) {
      await compareCountries(countryIds, selectedLanguage?.name || "English");
    }
  };

  const isValidComparison = selectedCountries.every((idx) => countryData[idx]);

  useEffect(() => {
    if (compareData && compareViewRef.current) {
      compareViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [compareData]);

  // Reset compareData when leaving/unmounting this page
  useEffect(() => {
    return () => resetCompareData();
  }, []);

  const renderCards = () => {
    const count = selectedCountries.length;

    if (count <= 3) {
      // For 2-3 cards, render in a single row with VS between
      return (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {selectedCountries.map((idx, index) => (
            <>
              <div key={`card-${idx}`} className="w-full">
                <CompareCountryCard
                  onOpen={() => handleModalOpen(idx)}
                  onClose={handleModalClose}
                  countryData={countryData}
                  idx={idx}
                  onRemove={
                    selectedCountries.length > 2
                      ? () => handleRemoveCountry(idx)
                      : undefined
                  }
                  isAdditionalCard={idx > 2}
                />
              </div>
              {index < selectedCountries.length - 1 && (
                <div
                  key={`vs-${idx}`}
                  className="hidden sm:flex items-center justify-center"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white">
                    <span className="text-gray-600">VS</span>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      );
    } else {
      // For 4 cards, render in 2x2 grid
      const firstRow = selectedCountries.slice(0, 2);
      const secondRow = selectedCountries.slice(2, 4);
      const fifthCard = selectedCountries[4];

      return (
        <div className="space-y-4">
          {/* First Row */}
          <div className="flex gap-4 items-center">
            {firstRow.map((idx, index) => (
              <>
                <div key={`card-${idx}`} className="w-full">
                  <CompareCountryCard
                    key={index}
                    onOpen={() => handleModalOpen(idx)}
                    onClose={handleModalClose}
                    countryData={countryData}
                    idx={idx}
                    onRemove={() => handleRemoveCountry(idx)}
                    isAdditionalCard={idx > 2}
                  />
                </div>
                {index < firstRow.length - 1 && (
                  <div
                    key={`vs-${idx}`}
                    className="hidden sm:flex items-center justify-center"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white">
                      <span className="text-gray-600">VS</span>
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>

          {/* Second Row */}
          <div className="flex gap-4 items-center">
            {secondRow.map((idx, index) => (
              <>
                <div key={`card-${idx}`} className="w-full">
                  <CompareCountryCard
                    key={index}
                    onOpen={() => handleModalOpen(idx)}
                    onClose={handleModalClose}
                    countryData={countryData}
                    idx={idx}
                    onRemove={() => handleRemoveCountry(idx)}
                    isAdditionalCard={idx > 2}
                  />
                </div>
                {index < secondRow.length - 1 && (
                  <div
                    key={`vs-${idx}`}
                    className="hidden sm:flex items-center justify-center"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white">
                      <span className="text-gray-600">VS</span>
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>

          {/* Fifth Card */}
          {fifthCard && (
            <div className="w-full">
              <CompareCountryCard
                key={fifthCard}
                onOpen={() => handleModalOpen(fifthCard)}
                onClose={handleModalClose}
                countryData={countryData}
                idx={fifthCard}
                onRemove={() => handleRemoveCountry(fifthCard)}
                isAdditionalCard={true}
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderResult = () => {
    const overview =
      compareData.overview ?? t("userDashboard.country.noDataAvailable");
    const internetSpeed =
      compareData.additionalComparisons.internetSpeed ??
      t("userDashboard.country.noDataAvailable");
    const publicTransportEfficiency =
      compareData.additionalComparisons.publicTransportEfficiency ??
      t("userDashboard.country.noDataAvailable");
    const workLifeBalance =
      compareData.additionalComparisons.workLifeBalance ??
      t("userDashboard.country.noDataAvailable");
    const population =
      compareData.additionalComparisons.population ??
      t("userDashboard.country.noDataAvailable");
    const dialingCodes =
      compareData.additionalComparisons.dialingCodes ??
      t("userDashboard.country.noDataAvailable");
    const languages =
      compareData.additionalComparisons.languages ??
      t("userDashboard.country.noDataAvailable");
    const avgCosts =
      compareData.costOfLiving.avgCosts ??
      t("userDashboard.country.noDataAvailable");
    const costSummary =
      compareData.costOfLiving.summary ??
      t("userDashboard.country.noDataAvailable");
    const corporateTax =
      compareData.taxAndFinance.corporateTax ??
      t("userDashboard.country.noDataAvailable");
    const federalRate =
      compareData.taxAndFinance.personalIncomeTax.federalRate ??
      t("userDashboard.country.noDataAvailable");
    const communalRate =
      compareData.taxAndFinance.personalIncomeTax.communalRate ??
      t("userDashboard.country.noDataAvailable");
    const longStays =
      compareData.visaAndImmigration.longStays ??
      t("userDashboard.country.noDataAvailable");
    const shortStays =
      compareData.visaAndImmigration.shortStays ??
      t("userDashboard.country.noDataAvailable");
    const visaSummary =
      compareData.visaAndImmigration.summary ??
      t("userDashboard.country.noDataAvailable");
    const passportsAndVisas =
      compareData.visaAndImmigration.passportsAndVisas ??
      t("userDashboard.country.noDataAvailable");

    return (
      <section id="comparison-view" ref={compareViewRef}>
        <div className="text-center my-14">
          <i className="fa fa-chevron-down"></i>
        </div>

        <div className="w-full mt-12 mb-6">
          <h2 className="text-3xl font-medium my-4 text-center underline underline-offset-4">
            {t("userDashboard.compareCountries.comparison")}
          </h2>
          {/* Overview */}
          <h2 className="text-2xl font-medium mb-2">
            {t("userDashboard.compareCountries.overview")}
          </h2>
          <p>{overview}</p>
          <br />

          <div className="space-y-8 max-w-5xl">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
              {/* Internet Speed */}
              <div className="grid">
                <div className="border border-gray-300 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">
                    <i className="fad fa-globe mr-2"></i>{" "}
                    {t("userDashboard.compareCountries.internetSpeed")}
                  </h3>
                  {internetSpeed}
                </div>
              </div>

              <div className="grid">
                <div className="border border-gray-300 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">
                    <i className="fad fa-bus mr-2"></i>{" "}
                    {t(
                      "userDashboard.compareCountries.publicTransportEfficiency"
                    )}
                  </h3>
                  {publicTransportEfficiency}
                </div>
              </div>

              <div className="grid">
                <div className="border border-gray-300 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">
                    <i className="fad fa-suitcase mr-2"></i>{" "}
                    {t("userDashboard.compareCountries.workAndLifeBalance")}
                  </h3>
                  {workLifeBalance}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-gray-300 p-4 rounded-xl">
                <h3 className="text-md lg:text-lg font-semibold mb-2">
                  <i className="fad fa-users mr-2"></i>{" "}
                  {t("userDashboard.compareCountries.population")}
                </h3>
                {population}
              </div>
              <div className="border border-gray-300 p-4 rounded-xl">
                <h3 className="text-md lg:text-lg font-semibold mb-2">
                  <i className="fad fa-phone mr-2"></i>{" "}
                  {t("userDashboard.compareCountries.dialingCodes")}
                </h3>
                {dialingCodes}
              </div>
              <div className="border border-gray-300 p-4 rounded-xl">
                <h3 className="text-md lg:text-lg font-semibold mb-2">
                  <i className="fad fa-language mr-2"></i>
                  {t("userDashboard.compareCountries.languages")}
                </h3>
                {languages}
              </div>
            </div>

            {/* Cost of Living */}
            <div className="border border-gray-300 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">
                <i className="fad fa-house mr-2"></i>{" "}
                {t("userDashboard.compareCountries.costOfLiving")}
              </h2>
              <p className="my-2">{avgCosts}</p>
              <p className="my-2">{costSummary}</p>
            </div>

            {/* Tax Comparison */}
            <div className="border border-gray-300 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">
                <i className="fad fa-dollar-sign mr-2"></i>{" "}
                {t("userDashboard.compareCountries.taxesAndFinances")}
              </h2>
              <table className="w-full text-left border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">
                      {t("userDashboard.compareCountries.taxType")}
                    </th>
                    <th className="p-2 border" colSpan={2}>
                      {t("userDashboard.compareCountries.comparison")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 align-top">
                      {t("userDashboard.compareCountries.corporateTax")}
                    </td>
                    <td className="p-2 break-words" colSpan={2}>
                      {corporateTax}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 align-top">
                      {t("userDashboard.compareCountries.incomeTax")}
                    </td>
                    <td className="p-2">
                      <p className="break-words">
                        <span className="font-semibold">
                          {t("userDashboard.compareCountries.federalRate")}:
                        </span>{" "}
                        {federalRate}
                      </p>{" "}
                      <br />
                      {compareData.taxAndFinance.personalIncomeTax
                        .communalRate && (
                        <p className="break-words">
                          <span className="font-semibold">
                            {t("userDashboard.compareCountries.communalRate")}:
                          </span>{" "}
                          {communalRate}
                        </p>
                      )}
                    </td>
                    <td className="p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Visa & Immigration */}
            <div className="border border-gray-300 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">
                <i className="fad fa-plane mr-2"></i>{" "}
                {t("userDashboard.compareCountries.visaAndImmigration")}
              </h2>
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="border border-gray-300 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    <i className="fad fa-building mr-2"></i>{" "}
                    {t("userDashboard.compareCountries.longStays")}
                  </h4>
                  <p>{longStays}</p>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    <i className="fad fa-hotel mr-2"></i>{" "}
                    {t("userDashboard.compareCountries.shortStays")}
                  </h4>
                  <p>{shortStays}</p>
                </div>

                <div className="border border-gray-300 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    <i className="fa fa-passport mr-2"></i>{" "}
                    {t("userDashboard.compareCountries.passportAndVisas")}
                  </h4>
                  <p>{passportsAndVisas}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <i className="fal fa-info-circle mr-2 mt-1"></i>{" "}
                <span>{visaSummary}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-medium">
          {t("userDashboard.sidebar.compareCountries")}
        </h2>
        <div className="mt-7 space-y-6">
          {renderCards()}

          {selectedCountries.length < 5 && (
            <div className="flex items-center justify-center mt-6">
              <button
                onClick={handleAddCountry}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-xl text-gray-600">+</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex mt-7 w-full items-center justify-end">
          <Button
            disabled={!isValidComparison || compareLoader}
            onClick={handleCountryCompare}
            className={`self-end h-12 px-8 disabled:cursor-not-allowed transition-colors ${
              isValidComparison && !compareLoader
                ? "bg-black hover:bg-black/90 text-white"
                : "bg-gray-400 text-white hover:bg-gray-500"
            }`}
          >
            {compareLoader ? <Spinner size="w-6 h-6" /> : "Compare"}
          </Button>
        </div>

        {compareData && renderResult()}

        <SelectCountryModal
          isOpen={openCountryModal}
          onClose={handleModalClose}
          onChange={handleCountrySelect}
        />
      </div>
    </DashboardLayout>
  );
}

export default CompareCountries;
