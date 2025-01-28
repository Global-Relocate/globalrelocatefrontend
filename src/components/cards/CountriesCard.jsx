import React from "react";
import pointer from "../../assets/svg/pointer.svg";

export default function CountriesCard({
  image,
  location,
  countryFlag,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-start space-y-3 relative w-[380px] `}
    >
      <button className="p-3 flex items-center gap-2 text-black bg-white rounded-3xl hover:bg-black hover:text-white text-sm font-semibold absolute top-7 right-4">
        <img src={pointer} alt="pointer" className="w-5 h-5" /> View
      </button>
      <img
        src={image}
        className={`w-full rounded-2xl object-cover h-[500px]`}
        alt=""
      />
      <div className="flex items-center justify-start space-x-2">
        <img
          src={countryFlag || countryImage}
          className="w-7 h-7 rounded-full object-cover"
          alt="logo"
        />
        <span>{location}</span>
      </div>
    </div>
  );
}
