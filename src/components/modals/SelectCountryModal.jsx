import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useCountryData } from "@/context/CountryDataContext";
import SearchInput from "../inputs/SearchInput";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import {
  getCountryName,
  getCountryCodeByName,
} from "@/data/country-translations";

const SelectCountryModal = ({ isOpen, onClose, onChange }) => {
  const { countryList, getCountryList } = useCountryData();
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    async function fetchCountryList() {
      await getCountryList();
    }
    fetchCountryList();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      // Filter countries based on search input
      const filtered = countryList.filter((country) => {
        const countryCode = getCountryCodeByName(country.name);
        return (
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (countryCode &&
            getCountryName(countryCode, selectedLanguage?.code)
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
        );
      });
      setDisplayedCountries(filtered);
    } else {
      // // Show 20 random countries when no search query
      // const shuffled = [...countryList].sort(() => 0.5 - Math.random());
      // setDisplayedCountries(shuffled.slice(0, 16));
      setDisplayedCountries(countryList);
    }
  }, [searchQuery, countryList]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery(""); // reset input when modal closes
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className="fixed inset-0 bg-black bg-opacity-10 animate-fadeIn"
        onClick={onClose}
      />
      <div
        className="absolute top-2 right-2 text-black cursor-pointer"
        onClick={onClose}
      >
        <MdClose />
      </div>
      <div className="bg-white rounded-2xl p-6 max-w-[800px] min-h-96 w-full mx-4 relative animate-modalIn">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("userDashboard.countries.searchCountries")}
        />

        <h1 className="mt-6 mb-3 text-xl font-medium">
          {searchQuery
            ? t("userDashboard.countries.searchResults")
            : t("userDashboard.countries.title")}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 h-[350px] mt-5 overflow-y-auto overflow-x-hidden">
          {displayedCountries.map((country) => (
            <div
              key={country.id}
              onClick={() => onChange(country)}
              className="flex gap-1 cursor-pointer max-h-[50px] items-center justify-start w-[140px]"
            >
              <img
                className="w-10 h-10 rounded-full object-cover border mr-3"
                src={
                  country.name === "Afghanistan"
                    ? "https://flagcdn.com/w320/af.png"
                    : country.flag
                }
                alt={country.name}
              />
              <span className="text-sm">
                {getCountryName(
                  getCountryCodeByName(country.name),
                  selectedLanguage?.code
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCountryModal;
