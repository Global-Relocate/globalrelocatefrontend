import React from "react";
import { GoHeart } from "react-icons/go";
import heartIcon from "../../assets/svg/heart.svg";
import pointerIcon from "../../assets/svg/pointer.svg";
import { Link } from "react-router-dom";

export default function CountriesCard({
  image,
  location,
  countryFlag,
  sm,
  isLiked,
  onLikeToggle,
  flagClassName = "w-6 h-6"
}) {
  return (
    <div
      className={`flex flex-col items-start space-y-3 relative ${
        sm ? "w-full md:w-[270px]" : "w-[380px]"
      } `}
    >
      <button
        className="p-3 flex items-center gap-2 text-black bg-white rounded-3xl hover:bg-black hover:text-white text-sm font-semibold absolute top-7 right-4"
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle?.();
        }}
      >
        {isLiked ? (
          <img 
            src={heartIcon} 
            alt="Liked" 
            className="w-5 h-5" 
            style={{ width: '1.3rem', height: '1.3rem' }} 
          />
        ) : (
          sm ? (
            <GoHeart style={{ width: '1.3rem', height: '1.3rem' }} />
          ) : (
            <Link to="/user/countries" className="flex items-center gap-2">
              <img 
                src={pointerIcon} 
                alt="View" 
                className="w-5 h-5" 
                style={{ width: '1.3rem', height: '1.3rem' }} 
              /> 
              <span>View</span>
            </Link>
          )
        )}
      </button>

      <Link to="/user/countries" className="w-full">
        <img
          src={image}
          className={`w-full rounded-2xl object-cover ${sm ? "h-[320px]" : "h-[500px]"}`}
          alt={location}
        />
      </Link>

      <div className="flex items-center justify-start space-x-2">
        <img
          src={countryFlag}
          alt={`${location} flag`}
          className={`rounded-full ${flagClassName}`}
        />
        <span>{location}</span>
      </div>
    </div>
  );
}
