import React from "react";
import { GoHeart } from "react-icons/go";
import { FaRegHandPointer } from "react-icons/fa";
import heartIcon from "../../assets/svg/heart.svg";

export default function CountriesCard({ 
  image, 
  location, 
  countryImage, 
  countryFlag,
  sm, 
  isLiked, 
  onLikeToggle,
  onClick 
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-start space-y-3 relative ${
        sm ? "w-full md:w-[270px]" : "w-[380px]"
      } `}
    >
      <button
        className="p-3 flex items-center gap-2 text-black bg-white rounded-3xl hover:bg-black hover:text-white text-sm font-semibold absolute top-7 right-4"
        onClick={onLikeToggle}
      >
        {isLiked ? (
          <img src={heartIcon} alt="Liked" className="w-5 h-5" style={{ width: '1.3rem', height: '1.3rem' }} />
        ) : (
          sm ? (
            <GoHeart style={{ width: '1.3rem', height: '1.3rem' }} />
          ) : (
            <>
              <FaRegHandPointer fontSize="1.3rem" color="#95ACF8" /> View
            </>
          )
        )}
      </button>
      <img
        src={image}
        className={`w-full rounded-2xl object-cover ${
          sm ? "h-[320px] cursor-pointer" : "h-[500px]"
        }`}
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
