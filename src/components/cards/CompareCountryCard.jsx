import React from "react";
import { MdAdd } from "react-icons/md";
import { ChevronDown } from "lucide-react";

const CompareCountryCard = ({ onOpen, countryData, idx }) => {
  console.log(countryData);
  return (
    <div className="flex item-center justify-center border border-dashed border-black rounded-md w-full h-[208px]">
      {countryData[idx] ? (
        <div className="w-full flex-col items-start flex p-4 justify-between">
          <div className="flex w-full items-start justify-between">
            <div className="bg-gray-200 text-9xl w-16 h-16 object-cover overflow-hidden flex items-center justify-center rounded-full">
              {countryData[idx]?.emoji}
            </div>

            <button
              onClick={() => onOpen(idx)}
              className="p-1 w-max rounded-full bg-black text-white"
            >
              <ChevronDown />
            </button>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-lg font-medium text-black">
              {countryData[idx]?.name}
            </span>
            <span className="text-sm text-gray-500">Europe</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col">
          <button
            onClick={() => onOpen(idx)}
            className="p-5 w-max rounded-full bg-[#FFEBC9] text-black"
          >
            <MdAdd />
          </button>
          <span>Please select a country</span>
        </div>
      )}
    </div>
  );
};

export default CompareCountryCard;
