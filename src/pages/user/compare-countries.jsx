import React, { useState } from "react";
import CompareCountryCard from "@/components/cards/CompareCountryCard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SelectCountryModal from "@/components/modals/SelectCountryModal";
import { Button } from "@/components/ui/button";
import { useCountryData } from "@/context/CountryDataContext";
import Spinner from "@/components/loaders/Spinner";

function CompareCountries() {
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [countryData, setCountryData] = useState({});
  const [countryIdx, setCountryIdx] = useState(1);

  const { compareLoader, compareCountries } = useCountryData()

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

  const handleCountryCompare = async () => {
    const idx1 = countryData[1]?.id
    const idx2 = countryData[2]?.id
    await compareCountries(idx1, idx2)
  }


  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-medium">Compare Countries</h2>
        <div className="flex flex-col md:flex-row w-full mt-7 gap-10 items-center justify-between">
          <CompareCountryCard
            onOpen={handleModalOpen}
            onClose={handleModalClose}
            countryData={countryData}
            idx={1}
          />
          <div className="border py-2 px-3 rounded-full">
            <span>VS</span>
          </div>
          <CompareCountryCard
            onOpen={handleModalOpen}
            onClose={handleModalClose}
            countryData={countryData}
            idx={2}
          />
        </div>

        <div className="flex mt-7 w-full items-center justify-end">
          <Button
            disabled={!countryData[1] || !countryData[2] || compareLoader}
            onClick={handleCountryCompare}
            className="self-end bg-[#FCA311] text-black hover:text-white px-8 w-32 disabled:cursor-not-allowed"
          >
            {compareLoader ? <Spinner size="w-6 h-6" /> : "Compare"}
          </Button>
        </div>

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

const obj = {
  alpha2: "AF",
  alpha3: "AFG",
  countryCallingCodes: ["+93"],
  currencies: ["AFN"],
  emoji: "🇦🇫",
  ioc: "AFG",
  languages: ["pus"],
  name: "Afghanistan",
  status: "assigned",
};
