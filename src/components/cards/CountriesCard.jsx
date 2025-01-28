import React from "react";
import { GoHeart } from "react-icons/go";
import heartIcon from "../../assets/svg/heart.svg";
import pointerIcon from "../../assets/svg/pointer.svg";

export default function CountriesCard({
  image,
  location,
  countryFlag,
  sm,
  isLiked,
  onLikeToggle,
  onClick
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
            <>
              <img 
                src={pointerIcon} 
                alt="View" 
                className="w-5 h-5" 
                style={{ width: '1.3rem', height: '1.3rem' }} 
              /> View
            </>
          )
        )}
      </button>
      <img
        src={image}
        className={`w-full rounded-2xl object-cover ${sm ? "h-[320px]" : "h-[500px]"}`}
        alt=""
        onClick={onClick}
      />
      <div className="flex items-center justify-start space-x-2">
        <img
          src={countryFlag}
          className="w-7 h-7 rounded-full object-cover"
          alt="logo"
        />
        <span>{location}</span>
      </div>
    </div>
  );
}
