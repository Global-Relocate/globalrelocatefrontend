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
  const [countryList, setCountryList] = useState([])
  const [compareData, setCompareData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [compareLoader, setCompareLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [singleCountry, setSingleCountry] = useState(null);
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");

  useEffect(() => {
    fetchCountries(true);
  }, [page, search, continent]);

  const fetchCountries = async (reset = false, preventLoader = false) => {
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
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const addCountryToFavourite = async (id) => {
    try {
      await axiosInstance.post(`/countries/favourite/add/${id}`);
      fetchCountries(true, true);
      toast.success("Added to favourite!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const getSingleCountry = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/countries/${id}`);
      setSingleCountry(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
    setLoading(false);
  };
  const getCountryList = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/countries/list`);
      setCountryList(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };
  const compareCountries = async (firstCountryId,
    secondCountryId) => {
    setCompareLoader(true);
    try {
      const response = await axiosInstance.post(`/countries/compare`, {
        firstCountryId,
        secondCountryId
      });
      setCompareData(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setCompareLoader(false);
    }
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
        getCountryList,
        countryList,
        compareCountries,
        compareData,
        compareLoader
      }}
    >
      {children}
    </CountryDataContext.Provider>
  );
};

export const useCountryData = () => useContext(CountryDataContext);
