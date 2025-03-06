import React, { useState } from "react";
import heartIcon from "../../assets/svg/heart.svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GoHeart } from "react-icons/go";
import { useCountryData } from "@/context/CountryDataContext";

export default function CountriesDashCard({
  id,
  onClick,
  images, // Changed to receive an array of images
  location,
  countryFlag,
  sm = true,
  isLiked,
  // onLikeToggle,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addCountryToFavourite } = useCountryData();

  const onAddToFavourite = async () => {
    setLoading(true);
    try {
      const res = await addCountryToFavourite(id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const countryImages = images;

  return (
    <div
      className={`flex flex-col items-start space-y-3 relative ${sm ? "w-full" : "w-[380px]"
        }`}
      onMouseEnter={() => setIsHovered(true)} // Set hover state on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Reset hover state on mouse leave
    >
      <button className="p-3 flex items-center gap-2 text-black bg-white rounded-3xl hover:bg-black hover:text-white text-sm font-semibold absolute top-7 right-4 z-10">
        {loading ? (
          <div className="w-4 h-4 border-2 border-black hover:border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            {isLiked ? (
              <img
                src={heartIcon}
                alt="Liked"
                className="w-5 h-5"
                style={{ width: "1.3rem", height: "1.3rem" }}
              />
            ) : (
              <GoHeart
                onClick={onAddToFavourite}
                style={{ width: "1.3rem", height: "1.3rem" }}
              />
            )}
          </>
        )}
      </button>

      {/* Carousel Component with images array */}
      <Carousel
        // initialIndex={0}
        loop={false} // Optionally loop images
        className={`w-full rounded-2xl `}
      >
        <CarouselContent className="rounded-2xl">
          {countryImages.map((item, i) => {
            return (
              <CarouselItem key={i} className="rounded-2xl">
                {" "}
                <img
                  src={item}
                  onClick={onClick}
                  alt="Main Image"
                  className={`w-full cursor-pointer ${sm ? "h-[320px]" : "h-[500px]"
                    } object-cover rounded-2xl`}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {isHovered && (
          <>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </>
        )}
      </Carousel>

      <div className="flex items-center justify-start space-x-2">
        <img
          src={countryFlag}
          className="w-7 h-7 rounded-full object-cover"
          alt="Country Flag"
        />
        <span>{location}</span>
      </div>
    </div>
  );
}
