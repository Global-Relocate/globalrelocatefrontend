import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useCountryData } from "@/context/CountryDataContext";
import SearchInput from "../inputs/SearchInput";

const SelectCountryModal = ({ isOpen, onClose, onChange }) => {
  const { countryList, getCountryList } = useCountryData();
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCountryList() {
      await getCountryList();
    }
    fetchCountryList();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      // Filter countries based on search input
      const filtered = countryList.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedCountries(filtered);
    } else {
      // Show 20 random countries when no search query
      const shuffled = [...countryList].sort(() => 0.5 - Math.random());
      setDisplayedCountries(shuffled.slice(0, 16));
    }
  }, [searchQuery, countryList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className="fixed inset-0 bg-black bg-opacity-10 animate-fadeIn"
        onClick={onClose}
      />
      <div className="absolute top-2 right-2 text-black cursor-pointer" onClick={onClose}>
        <MdClose />
      </div>
      <div className="bg-white rounded-2xl p-6 max-w-[800px] min-h-96 w-full mx-4 relative animate-modalIn">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search countries"
        />

        <h1 className="mt-6 mb-3 text-xl font-medium">
          {searchQuery ? "Search results" : "Ai Suggested countries"}
        </h1>

        <div className="flex w-full flex-wrap gap-x-4 gap-y-7 justify-between h-[350px] mt-5 overflow-y-auto">
          {displayedCountries.map((country) => (
            <div key={country.id} onClick={() => onChange(country)} className="flex gap-1 cursor-pointer max-h-[50px] items-center justify-start w-[140px]">
              <img className="w-10 h-10 rounded-full object-cover border" src={country.name === "Afghanistan" ? "https://flagcdn.com/w320/af.png" : country.flag} alt={country.name} />
              <span className="text-sm">{country.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCountryModal;
