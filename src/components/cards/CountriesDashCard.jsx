import React, { useEffect, useState } from "react";
import { BsHeart } from "react-icons/bs";
import { FaRegHandPointer } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CountriesDashCard({
  onClick,
  images, // Changed to receive an array of images
  location,
  countryFlag,
  sm,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const countryImages = images;
  //   const countryImages = isHovered ? images : [images[0]];

  return (
    <div
      className={`flex flex-col items-start space-y-3 relative ${
        sm ? "w-full md:w-[270px]" : "w-[380px]"
      }`}
      onMouseEnter={() => setIsHovered(true)} // Set hover state on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Reset hover state on mouse leave
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

      {/* Carousel Component with images array */}
      <Carousel
        initialIndex={0} // Set the first image as default
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
                  className={`w-full cursor-pointer ${
                    sm ? "h-[320px]" : "h-[500px]"
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
