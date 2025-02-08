import React from "react";
import { CountryDropdown } from "../ui/country-dropdown";
import { MdClose } from "react-icons/md";

const SelectCountryModal = ({ isOpen, onClose, onChange, value }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className="fixed inset-0 bg-black bg-opacity-10 animate-fadeIn"
        onClick={onClose}
      />
      <div className="absolute top-2 right-2 text-black">
        <MdClose />
      </div>
      <div className="bg-white rounded-2xl p-6 max-w-[700px] min-h-96 w-full mx-4 relative animate-modalIn">
        <CountryDropdown onChange={onChange} value={value} />

        <h1 className="mt-6 text-xl font-medium">Ai Suggested countries</h1>
        <div className="flex w-full flex-wrap justify-between"></div>
      </div>
    </div>
  );
};

export default SelectCountryModal;
