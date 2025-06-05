import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { GrFavorite } from "react-icons/gr";
// import { useFavorites } from "@/context/favorites-context";
import CountriesDashCard from "@/components/cards/CountriesDashCard";
import SearchInput from "@/components/inputs/SearchInput";
import { useCountryData } from "@/context/CountryDataContext";
import nigeria from "../../assets/images/nigeria.png";
import swizerland from "../../assets/images/swizerland.png";
import { useTranslation } from "react-i18next";

function Favorites() {
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { favourites } = useCountryData();
  const { t } = useTranslation();

  // const { toggleFavorite } = useFavorites(); // uncomment if needed

  const filteredFavorites =
    favourites?.filter((country) =>
      country.countryName.toLowerCase().startsWith(searchQuery.toLowerCase())
    ) || [];

  useEffect(() => {
    // Optional: handle errors if needed
    if (!favourites) {
      setError(new Error("Favorites not found"));
    }
  }, [favourites]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <DashboardLayout>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h2 className="text-3xl font-medium">
          {t("userDashboard.sidebar.favourites")}
        </h2>
        {favourites?.length > 0 && (
          <div className="flex w-full sm:w-auto items-center space-x-2">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {!favourites?.length ? (
        <div className="flex flex-col items-center justify-center h-[45vh]">
          <GrFavorite size={36} className="mb-4 text-gray-600" />
          <p className="text-gray-600">
            {t("userDashboard.favorites.noFavorites")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-10">
          {filteredFavorites.map((country) => (
            <CountriesDashCard
              key={country.countryId}
              id={country.countryId}
              location={country.countryName}
              isLiked={country.isLiked}
              // onLikeToggle={() => toggleFavorite(item)}
              onClick={() =>
                navigate(`/user/countries/${country.countryId}`, {
                  state: country.countryFlag,
                })``
              }
              images={[swizerland, nigeria, swizerland, nigeria]}
              countryFlag={country.countryFlag}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Favorites;
