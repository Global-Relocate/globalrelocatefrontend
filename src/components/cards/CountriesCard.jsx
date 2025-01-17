import React from "react";
import { BsHeart } from "react-icons/bs";
import { FaRegHandPointer } from "react-icons/fa";

export default function CountriesCard({ image, location, countryImage, sm }) {
  return (
    <div
      className={`flex flex-col items-start space-y-3 relative ${
        sm ? "w-full md:w-[270px]" : "w-[380px]"
      } `}
    >
      <button className="p-3 flex items-center gap-2 text-black bg-white rounded-3xl hover:bg-black hover:text-white text-sm font-semibold absolute top-7 right-4">
        {sm ? (
          <BsHeart />
        ) : (
          <>
            {" "}
            <FaRegHandPointer fontSize="1.3rem" color="#95ACF8" /> View
          </>
        )}
      </button>
      <img
        src={image}
        className={`w-full rounded-2xl object-cover ${sm ? "h-[320px]" : "h-[500px]"}`}
        alt=""
      />
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
