import axiosInstance from "@/config/axiosInstance";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";

const CountryDataContext = createContext();

export const CountryDataProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [singleCountry, setSingleCountry] = useState(null);
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");

  useEffect(() => {
    fetchCountries(true);
  }, [page, search, continent]);

  const fetchCountries = async (reset = false, preventLoader = false) => {
    if (loading) return;
    if (!preventLoader) {
      setLoading(true);
    }
    try {
      const response = await axiosInstance.get(
        `/countries?page=${page}&limit=20&country=${search}&continent=${continent}`
      );
      setCountries((prev) =>
        reset ? response.data.data : [...prev, ...response.data.data]
      );
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      console.error("Error fetching countries:", error);
    }
    setLoading(false);
  };

  const addCountryToFavourite = async (id) => {
    try {
      await axiosInstance.post(`/countries/favourite/add/${id}`);
      fetchCountries(true, true);
    } catch (error) {
      console.error("Error adding country to favorites:", error);
    }
  };

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
        addCountryToFavourite,
        search,
        setSearch,
        continent,
        setContinent,
      }}
    >
      {children}
    </CountryDataContext.Provider>
  );
};

export const useCountryData = () => useContext(CountryDataContext);
