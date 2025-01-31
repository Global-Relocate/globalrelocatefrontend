import CountriesCard from "@/components/cards/CountriesCard";
import SearchInput from "@/components/inputs/SearchInput";
import React, { useState } from "react";
// countries imports
import nigeria from "../../assets/images/nigeria.png";
import swizerland from "../../assets/images/swizerland.png";
import london from "../../assets/images/london.png";
import italy from "../../assets/images/italy.png";
import china from "../../assets/images/china.png";
import uae from "../../assets/images/uae.png";
import { useNavigate } from "react-router-dom";
import AiChatInput from "@/components/forms/AiChatInput";
import CountriesDashCard from "@/components/cards/CountriesDashCard";
import { useFavorites } from "@/context/favorites-context";
import FilterButton from "@/components/utils/FilterButton";

function Countries() {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = [
    "All",
    "Europe",
    "Asia",
    "Africa",
    "South America",
    "North America",
    "Antarctia",
    "Oceania"
  ];

  const handleLikeToggle = (country) => {
    toggleFavorite(country);
  };

  const countriesData = [
    {
      images: [swizerland, nigeria, swizerland, nigeria],
      location: "Zürich, Switzerland",
      countryFlag:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png",
    },
    {
      images: [london],
      location: "London, UK",
      countryFlag:
        "https://t4.ftcdn.net/jpg/08/32/02/87/360_F_832028757_4YU1BrvVBRUNJX7WvLf5g4Qm5xrjOBo6.jpg",
    },
    {
      images: [china],
      location: "Beijing, China",
      countryFlag:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx-FLVbYtX7A6P_Zjkt5pp0DafB3gXraLsNQ&s",
    },
    {
      images: [italy],
      location: "Milan, Italy",
      countryFlag:
        "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/220px-Flag_of_Italy.svg.png",
    },
    {
      images: [uae],
      location: "UAE",
      countryFlag:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png",
    },
    {
      images: [nigeria],
      location: "Lagos, Nigeria",
      countryFlag:
        "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg",
    },
    {
      images: [nigeria],
      location: "Abuja, Nigeria",
      countryFlag:
        "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg",
    },
    {
      images: [nigeria],
      location: "Ibadan, Nigeria",
      countryFlag:
        "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg",
    },
  ];

  return (
    <>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h2 className="text-3xl font-medium">Countries</h2>
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <SearchInput />
        </div>
      </div>

      <div className="flex items-center gap-4 w-full overflow-x-scroll no-scrollbar mt-5">
        {filterOptions.map((filter) => (
          <FilterButton
            key={filter}
            title={filter}
            isActive={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-y-10 py-10">
        {countriesData.map((item, i) => (
          <CountriesDashCard
            key={i}
            location={item.location}
            isLiked={isFavorite(item.location)}
            onLikeToggle={() => handleLikeToggle(item)}
            onClick={() => navigate("/user/countries/switzerland")}
            images={item.images}
            countryFlag={item.countryFlag}
          />
        ))}
      </div>
    </>
  );
}

export default Countries;
