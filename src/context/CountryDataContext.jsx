import axiosInstance from "@/config/axiosInstance";
import { createContext, useContext, useEffect, useState } from "react";

const CountryDataContext = createContext();

export const CountryDataProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [singleCountry, setSingleCountry] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, [page]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/countries?limit=40`);
      console.log(response.data.data)
      setCountries(response.data.data);
      // setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
    setLoading(false);
  };
  const addCountryToFavourite = async (id) => {
    try {
      const response = await axiosInstance.get(`/countries/addToFavourites/${id}`);
      fetchCountries()
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
 
  };

  // Fetch a single country by ID
  const getSingleCountry = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/countries/${id}`);
      setSingleCountry(response.data.data);
    } catch (error) {
      console.error("Error fetching single country:", error);
    }
    setLoading(false);
  };

  return (
    <CountryDataContext.Provider
      value={{
        countries,
        loading,
        page,
        setPage,
        totalPages,
        singleCountry,
        getSingleCountry,
        addCountryToFavourite
      }}
    >
      {children}
    </CountryDataContext.Provider>
  );
};

// Custom hook to use CountryDataContext
export const useCountryData = () => useContext(CountryDataContext);
