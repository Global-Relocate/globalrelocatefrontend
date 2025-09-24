import { useEffect, useRef, useState } from "react";
import CompareCountryCard from "@/components/cards/CompareCountryCard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SelectCountryModal from "@/components/modals/SelectCountryModal";
import { Button } from "@/components/ui/button";
import { useCountryData } from "@/context/CountryDataContext";
import Spinner from "@/components/loaders/Spinner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import ComparisonTable from "@/components/common/comparison-table";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

function CompareCountries() {
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [countryData, setCountryData] = useState({});
  const [countryIdx, setCountryIdx] = useState(1);
  const [selectedCountries, setSelectedCountries] = useState([1, 2]);

  const {
    compareLoader,
    compareCountries,
    compareData,
    resetCompareData,
  } = useCountryData();
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
    return (
      <section id="comparison-view" ref={compareViewRef}>
        <div className="text-center my-14">
          <i className="fa fa-chevron-down"></i>
        </div>

        <div className="w-full mt-12 mb-6">
          <h2 className="text-3xl font-medium mb-12 text-center underline underline-offset-4">
            {t("userDashboard.compareCountries.comparison")}
          </h2>
          <ComparisonTable data={compareData} />
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
