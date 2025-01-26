import SearchInput from "@/components/inputs/SearchInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
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

function Countries() {
  const navigate = useNavigate();
import { useFavorites } from "@/context/favorites-context";

function Countries() {
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleLikeToggle = (country) => {
    toggleFavorite(country);
  };

  const countriesData = [
    {
      image: swizerland,
      location: "Zürich, Switzerland",
      countryImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png",
    },
    {
      image: london,
      location: "London, UK",
      countryImage: "https://t4.ftcdn.net/jpg/08/32/02/87/360_F_832028757_4YU1BrvVBRUNJX7WvLf5g4Qm5xrjOBo6.jpg",
    },
    {
      image: china,
      location: "Beijing, China",
      countryImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx-FLVbYtX7A6P_Zjkt5pp0DafB3gXraLsNQ&s",
    },
    {
      image: italy,
      location: "Milan, Italy",
      countryImage: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/220px-Flag_of_Italy.svg.png",
    },
    {
      image: uae,
      location: "UAE",
      countryImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png",
    },
    {
      image: nigeria,
      location: "Lagos, Nigeria",
      countryImage: "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg",
    },
    {
      image: nigeria,
      location: "Lagos, Nigeria",
      countryImage: "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg",
    },
    {
      image: nigeria,
      location: "Lagos, Nigeria",
      countryImage: "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg",
    },
  ];

  return (
    <DashboardLayout>
      <AiChatInput />
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h2 className="text-3xl font-medium">Countries</h2>
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <SearchInput />
        </div>
      </div>

      <div className="flex items-center gap-4 w-full overflow-x-scroll no-scrollbar mt-5">
        <FilterButton title="All" isActive={true} />
        <FilterButton title="Europe" />
        <FilterButton title="Asia" />
        <FilterButton title="Africa" />
        <FilterButton title="South America" />
        <FilterButton title="North America" />
        <FilterButton title="Antarctia" />
        <FilterButton title="Oceania" />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-y-10  py-10">
        <CountriesDashCard
          onClick={() => navigate("/user/countries/switzerland")}
          images={[swizerland, nigeria, swizerland, nigeria]}
          location="Zürich, Switzerland"
          countryFlag="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png"
        />
        <CountriesDashCard
          onClick={() => navigate("/user/countries/switzerland")}
          images={[london]}
          location="London, UK"
          countryFlag="https://t4.ftcdn.net/jpg/08/32/02/87/360_F_832028757_4YU1BrvVBRUNJX7WvLf5g4Qm5xrjOBo6.jpg"
        />
        <CountriesDashCard
          onClick={() => navigate("/user/countries/switzerland")}
          images={[china]}
          location="Beijing, China"
          countryFlag="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx-FLVbYtX7A6P_Zjkt5pp0DafB3gXraLsNQ&s"
        />
        <CountriesDashCard
          onClick={() => navigate("/user/countries/switzerland")}
          images={[italy]}
          location="Milan, Italy"
          countryFlag="https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/220px-Flag_of_Italy.svg.png"
        />
        <CountriesDashCard
          onClick={() => navigate("/user/countries/switzerland")}
          images={[uae]}
          location="UAE"
          countryFlag="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png"
        />
        <CountriesDashCard
          onClick={() => navigate("/user/countries/switzerland")}
          images={[nigeria]}
          location="Lagos, Nigeria"
          countryFlag="https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg"
        />
        <CountriesDashCard
          onClick={() => navigate("/user/countries/switzerland")}
          images={[nigeria]}
          location="Lagos, Nigeria"
          countryFlag="https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg"
        />
        <CountriesDashCard
          onClick={() => navigate("/user/countries/switzerland")}
          images={[nigeria]}
          location="Lagos, Nigeria"
          countryFlag="https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg"
        />
      <div className="flex items-center justify-between flex-wrap gap-y-10 py-10">
        {countriesData.map((country) => (
          <CountriesCard
            key={country.location}
            sm={true}
            image={country.image}
            location={country.location}
            countryImage={country.countryImage}
            isLiked={isFavorite(country.location)}
            onLikeToggle={() => handleLikeToggle(country)}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Countries;
