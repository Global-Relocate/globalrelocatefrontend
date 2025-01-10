import React from "react";
import { FaRegHandPointer } from "react-icons/fa";

export default function CountriesCard({ image, location, countryImage }) {
  return (
    <div className="flex flex-col items-start space-y-3 w-[380px] relative">
      <button className="p-3 flex items-center gap-2 text-black bg-white rounded-3xl hover:bg-black hover:text-white text-sm font-semibold absolute top-7 right-4">
        <FaRegHandPointer fontSize="1.3rem" color="#95ACF8" /> View
      </button>
      <img src={image} className="w-full rounded-2xl h-[500px]" alt="" />
      <div className=" flex items-center justify-start space-x-2 ">
        <img
          src={countryImage}
          className="w-7 h-7 rounded-full object-cover"
          alt="logo"
        />

        <span>{location}</span>
      </div>
    </div>
  );
}
