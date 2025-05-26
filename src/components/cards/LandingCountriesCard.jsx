import React from "react";
import { GoHeart } from "react-icons/go";
import heartIcon from "../../assets/svg/heart.svg";
import pointerIcon from "../../assets/svg/pointer.svg";
import { Link } from "react-router-dom";
import { useCountryData } from "@/context/CountryDataContext";

export default function CountriesCard({
  image,
  location,
  countryFlag,
  sm,
  flagClassName = "w-6 h-6"
}) {
  
  return (
    <div
      className={`flex flex-col items-start space-y-3 relative ${
        sm ? "w-full md:w-[270px]" : "w-full sm:w-[300px] md:w-[380px]"
      } `}
    >
      <button
        className="p-2 sm:p-3 flex items-center gap-2 text-black bg-white rounded-3xl hover:bg-black hover:text-white text-xs sm:text-sm font-semibold absolute top-4 sm:top-7 right-3 sm:right-4"
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle?.();
        }}
      >
        {sm ? (
            <GoHeart style={{ width: '1.1rem', height: '1.1rem' }} />
          ) : (
            <Link to="/user/countries" className="flex items-center gap-2">
              <img 
                src={pointerIcon} 
                alt="View" 
                className="w-4 h-4 sm:w-5 sm:h-5" 
                style={{ width: '1.1rem', height: '1.1rem' }} 
              /> 
              <span className="text-xs sm:text-sm">View</span>
            </Link>
          )
        }
      </button>

      <Link to="/user/countries" className="w-full">
        <img
          src={image}
          className={`w-full rounded-2xl object-cover ${sm ? "h-[250px] sm:h-[280px] md:h-[320px]" : "h-[300px] sm:h-[400px] md:h-[500px]"}`}
          alt={location}
        />
      </Link>

      <div className="flex items-center justify-start space-x-2">
        <img
          src={countryFlag}
          alt={`${location} flag`}
          className={`rounded-full ${flagClassName}`}
        />
        <span className="text-sm sm:text-base">{location}</span>
      </div>
    </div>
  );
}