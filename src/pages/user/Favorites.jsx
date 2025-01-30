import DashboardLayout from "@/components/layouts/DashboardLayout";
import React, { useState } from "react";
import { GrFavorite } from "react-icons/gr";
import { useFavorites } from "@/context/favorites-context";
import CountriesDashCard from "@/components/cards/CountriesDashCard";
import SearchInput from "@/components/inputs/SearchInput";

function Favorites() {
  const [error, setError] = useState(null);

  try {
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFavorites = favorites.filter((country) =>
      country.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <DashboardLayout>
        <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
          <h2 className="text-3xl font-medium">Favorites</h2>
          {favorites?.length > 0 && (
            <div className="flex w-full sm:w-auto items-center space-x-2">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {!favorites?.length ? (
          <div className="flex flex-col items-center justify-center h-[45vh]">
            <GrFavorite size={36} className="mb-4 text-gray-600" />
            <p className="text-gray-600">You haven't liked any favorites yet.</p>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-y-10 py-10">
            {filteredFavorites.map((country) => (
              <CountriesDashCard
                key={country.location}
                sm={true}
                images={Array.isArray(country.images) ? country.images : [country.image || country.images]}
                location={country.location}
                countryFlag={country.countryFlag}
                isLiked={isFavorite(country.location)}
                onLikeToggle={() => toggleFavorite(country)}
              />
            ))}
          </div>
        )}
      </DashboardLayout>
    );
  } catch (err) {
    setError(err);
    return <div>Error loading favorites: {err.message}</div>;
  }
}

export default Favorites;
