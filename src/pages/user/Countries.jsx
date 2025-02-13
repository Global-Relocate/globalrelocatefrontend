import CountriesCard from "@/components/cards/CountriesCard";
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
import { useFavorites } from "@/context/favorites-context";
import FilterButton from "@/components/utils/FilterButton";
import { useCountryData } from "@/context/CountryDataContext";
import { Skeleton } from "@/components/ui/skeleton";

function Countries() {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeFilter, setActiveFilter] = useState("All");
  const { countries, loading, page, setPage, totalPages } = useCountryData();

  console.log(countries);

  const filterOptions = [
    "All",
    "Europe",
    "Asia",
    "Africa",
    "South America",
    "North America",
    "Antarctia",
    "Oceania",
  ];

  const handleLikeToggle = (country) => {
    toggleFavorite(country);
  };

  return (
    <DashboardLayout>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-10 py-10">
        {loading ? (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-full md:w-[270px]">
                <Skeleton className="h-[320px] w-full rounded-xl" />
                <div className="flex items-center space-x-2 mt-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {countries?.map((item, i) => {
              return (
                <CountriesDashCard
                  key={item.countryID || i}
                  location={item.countryName}
                  isLiked={item.isLiked}
                  onLikeToggle={() => handleLikeToggle(item)}
                  onClick={() => navigate(`/user/countries/${item.countryID}`)}
                  images={[swizerland, nigeria, swizerland, nigeria]}
                  countryFlag={item.countryFlag}
                />
              );
            })}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Countries;
