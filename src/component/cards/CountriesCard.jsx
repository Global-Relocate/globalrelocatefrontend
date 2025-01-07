import React from "react";

export default function CountriesCard({ image, location, countryImage }) {
  return (
    <div className="flex flex-col items-start space-y-3 w-[380px]">
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
