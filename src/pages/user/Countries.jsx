import SearchInput from "@/components/inputs/SearchInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CountriesDashCard from "@/components/cards/CountriesDashCard";
import { useFavorites } from "@/context/favorites-context";
import FilterButton from "@/components/utils/FilterButton";
import { useCountryData } from "@/context/CountryDataContext";
import { Skeleton } from "@/components/ui/skeleton";
// countries imports
import nigeria from "../../assets/images/nigeria.png";
import swizerland from "../../assets/images/swizerland.png";
import london from "../../assets/images/london.png";
import italy from "../../assets/images/italy.png";
import china from "../../assets/images/china.png";
import uae from "../../assets/images/uae.png";

function Countries() {
  const navigate = useNavigate();
  const { toggleFavorite } = useFavorites();
  const {
    countries,
    loading,
    page,
    setPage,
    totalPages,
    setSearch,
    setContinent,
  } = useCountryData();

  const [activeFilter, setActiveFilter] = useState("All");
  const observer = useRef(null);

  const filterOptions = [
    "All",
    "Europe",
    "Asia",
    "Africa",
    "South America",
    "North America",
    "Antarctica",
    "Oceania",
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page when searching
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setContinent(filter === "All" ? "" : filter);
    setPage(1); // Reset page on filter change
  };

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect(); // Disconnect previous observer

      if (node) {
        // Only observe if a node is provided
        observer.current = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !loading && page < totalPages) {
              // Check NOT loading
              setPage((prevPage) => prevPage + 1);
            }
          },
          { threshold: 0.5 } // Adjust threshold as needed (0.5 means 50% of the element is visible)
        );
        observer.current.observe(node);
      }
    },
    [loading, page, totalPages]
  ); // Add loading to the dependency array

  useEffect(() => {
    // This useEffect is crucial for resetting the observer when dependencies change
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, page, totalPages]); // Add loading, page, and totalPages to the dependency array

  return (
    <DashboardLayout>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h2 className="text-3xl font-medium">Countries</h2>
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <SearchInput onChange={handleSearch} />
        </div>
      </div>

      <div className="flex items-center gap-4 w-full overflow-x-scroll no-scrollbar mt-5">
        {filterOptions.map((filter) => (
          <FilterButton
            key={filter}
            title={filter}
            isActive={activeFilter === filter}
            onClick={() => handleFilter(filter)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-10 py-10">
        {/* Main Loader - only visible when fetching first page */}
        {loading && page === 1
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-full md:w-[270px]">
                <Skeleton className="h-[320px] w-full rounded-xl" />
                <div className="flex items-center space-x-2 mt-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          : countries.map((item, i) => {
              const isLastElement = i === countries.length - 1;
              console.log(isLastElement);
              return (
                <div
                  key={item.countryId || i}
                  ref={isLastElement ? lastElementRef : null}
                >
                  <CountriesDashCard
                    id={item.countryId}
                    location={item.countryName}
                    isLiked={item.isLiked}
                    // onLikeToggle={() => toggleFavorite(item)}
                    onClick={() =>
                      navigate(`/user/countries/${item.countryId}`)
                    }
                    images={[swizerland, nigeria, swizerland, nigeria]}
                    countryFlag={item.countryFlag}
                  />
                </div>
              );
            })}
      </div>

      {/* Infinite Scroll Loader - only visible when fetching more */}
      {loading && page > 1 && (
        <div className="flex justify-center items-center py-4">
          <div className="w-6 h-6 border-2 border-[#5762D5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Countries;
