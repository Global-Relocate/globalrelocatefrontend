import axios from "axios";
import { useEffect, useState, useRef } from "react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { CountryDropdown } from "@/components/ui/all-country-dropdown";
import { useTranslation } from "react-i18next";
import { CircleFlag } from "react-circle-flags";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { toast } from "sonner";
import PageLoader from "@/components/loaders/PageLoader";
import { getCountryName } from "@/data/country-translations";
import { useLanguage } from "@/context/LanguageContext";

export default function VisaIndex() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const checkVisa = useRef(null);

  const [query, setQuery] = useState("");
  const [passportQuery, setPassportQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [visaInfo, setVisaInfo] = useState(null);
  const [passportRanking, setPassportRanking] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedDestinationCode, setSelectedDestinationCode] = useState(null);

  const screenMaxWidth = window.innerWidth;
  const baseURL = import.meta.env.VITE_API_URL;

  const handleInputChange = (field, value) => {
    if (field === "country") {
      setSelectedCountry(value);
    } else if (field === "destination") {
      setSelectedDestination(value);
    }
  };

  const checkVisaRequirements = async () => {
    setCheckLoading(true);

    if (selectedCountryCode === selectedDestinationCode) {
      toast.error(t("userDashboard.visaIndex.sameCountryError"));
      setCheckLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.henleypassportindex.com/api/v3/visa-single/${selectedCountryCode.toUpperCase()}`
      );
      setVisaInfo(response.data);
    } catch (err) {
      setVisaInfo(null);
      toast.error(err.response.data.message);
    } finally {
      setCheckLoading(false);
    }
  };

  const fetchPassportRanking = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.henleypassportindex.com/api/v2/hpp`
      );

      setPassportRanking(
        response.data
          .filter((rank) => rank?.hpp_rank)
          .sort((a, b) => a.hpp_rank - b.hpp_rank)
          .reduce((acc, country) => {
            const rank = country.hpp_rank;
            if (!acc[rank]) acc[rank] = [];
            acc[rank].push(country);
            return acc;
          }, {})
      );
    } catch (error) {
      console.error("Error fetching passport ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassportRanking();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  // Filter based on query
  const filteredGrouped = Object.entries(passportRanking).reduce(
    (acc, [rank, countries]) => {
      const matched = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(query.toLowerCase()) ||
          country.code.toLowerCase().includes(query.toLowerCase())
      );
      if (matched.length > 0) acc[rank] = matched;
      return acc;
    },
    {}
  );

  // Filter passport based on query
  const filteredPassportGrouped = Object.entries(passportRanking).reduce(
    (acc, [rank, countries]) => {
      const matched = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(passportQuery.toLowerCase()) ||
          country.code.toLowerCase().includes(passportQuery.toLowerCase())
      );
      if (matched.length > 0) acc[rank] = matched;
      return acc;
    },
    {}
  );

  const scrollToCheckVisa = () => {
    if (checkVisa.current) {
      checkVisa.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <DashboardLayout>
      <main>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-[2.5rem] leading-[1.2]">
              {t("userDashboard.visaIndex.title")}
            </h1>
            <p className="font-medium">
              {t("userDashboard.visaIndex.description")}
            </p>
            <Button
              variant="primary"
              onClick={() => scrollToCheckVisa()}
              className="bg-[#c6952c] text-white h-[58px] max-w-[280px] text-md font-semibold cursor-pointer text-wrap"
            >
              {t("userDashboard.visaIndex.checkIfYouNeedVisa")}
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Input
                placeholder={t("userDashboard.visaIndex.searchPlaceholder")}
                className="h-12 hover:border-primary hover:border-2 rounded-[10px]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[300px] md:h-[460px] w-full rounded-md border bg-white p-4">
              <div className="font-semibold mb-4">
                {t("userDashboard.visaIndex.passportRankings")} - 2025
              </div>
              {filteredGrouped && Object.keys(filteredGrouped).length > 0 ? (
                Object.entries(filteredGrouped).map(([rank, countries]) => (
                  <div key={rank} className="mt-4">
                    {/* Rank Header */}
                    <div className="flex justify-between items-center bg-secondary rounded-md border-2 border-[#c6952c] py-[0.5rem] pl-[1rem] pr-[10px]">
                      <div className="font-semibold text-[#c6952c] text-[14px]">
                        {t("userDashboard.visaIndex.rank")}: {rank}
                      </div>
                      <div className="font-semibold text-[#c6952c] text-[14px]">
                        {t("userDashboard.visaIndex.visaFreeDestinations")}:{" "}
                        <span className="font-semibold">
                          {countries[0]?.visa_free_list?.length}
                        </span>
                      </div>
                    </div>

                    {/* Countries under this rank */}
                    {countries.map((country) => (
                      <Link
                        key={country?.code}
                        to={`/visa-requirements/${country.code.toLowerCase()}`}
                        className="text-primary flex items-center gap-x-4 h-[57px]"
                      >
                        <CircleFlag
                          countryCode={country?.code?.toLowerCase()}
                          height={20}
                          width={30}
                        />
                        {getCountryName(country.code, selectedLanguage?.code)}
                      </Link>
                    ))}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full mt-6">
                  <p className="text-center">
                    {t("userDashboard.visaIndex.noResults")}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div className="">
            <h2 className="font-semibold text-[2rem] leading-[1.2]">
              {t("userDashboard.visaIndex.explorePassportRanking")}
            </h2>
            <p className="mt-2">
              {t("userDashboard.visaIndex.explorePassportRankingDesc")}
            </p>
          </div>

          <div className="flex flex-col">
            <div>
              <Input
                placeholder={t("userDashboard.visaIndex.searchPlaceholder")}
                className="h-12 hover:border-primary hover:border-2 rounded-[10px]"
                value={passportQuery}
                onChange={(e) => setPassportQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="mt-4">
          <h3 className="font-semibold text-2xl mb-6">
            {t("userDashboard.visaIndex.mostPowerfulPassports")}
          </h3>

          <div className="mt-2">
            <ScrollArea className="h-[600px] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                {filteredPassportGrouped &&
                Object.keys(filteredPassportGrouped).length > 0 ? (
                  Object.entries(filteredPassportGrouped).map(
                    ([rank, countries]) =>
                      countries.map((country) => (
                        <Link
                          to={`/visa-requirements/${country.code.toLowerCase()}`}
                          key={country.code}
                          className="border-2 border-black rounded-md py-[8px] px-[10px]"
                        >
                          <div className="rounded-lg h-[341px] w-[230px] mx-auto">
                            <img
                              src={`${baseURL}/image/fetch/${country.code.toLowerCase()}`}
                              alt={country.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center gap-x-4 h-[57px] mt-2">
                            <CircleFlag
                              countryCode={country.code.toLowerCase()}
                              height={20}
                              width={30}
                            />
                            <div className="text-primary flex flex-col">
                              {getCountryName(
                                country.code,
                                selectedLanguage?.code
                              )}
                              <h3 className="font-semibold">
                                {t("userDashboard.visaIndex.rank")}: {rank}
                              </h3>
                            </div>
                          </div>
                        </Link>
                      ))
                  )
                ) : (
                  <div className="flex items-center justify-center h-full col-span-full">
                    <p className="text-center">
                      {t("userDashboard.visaIndex.noResults")}
                    </p>
                  </div>
                )}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </section>

        <section className="mt-10" id="checkVisa" ref={checkVisa}>
          <div className="flex flex-col">
            <h2 className="font-semibold text-[2rem] leading-[1.2]">
              {t("userDashboard.visaIndex.doINeedAVisa")}
            </h2>
            <p className="mt-2">
              {t("userDashboard.visaIndex.doINeedAVisaDesc")}
            </p>
          </div>

          <div className="border-2 border-[#F6E9E3] p-[25px] rounded-[13px] mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 font-semibold uppercase text-sm">
                  {t("userDashboard.visaIndex.iHaveAVisaFrom")}
                </label>
                <CountryDropdown
                  value={selectedCountry}
                  onChange={(country) => {
                    handleInputChange("country", country.alpha2);
                    setSelectedCountryCode(country.alpha2);
                    setSelectedCountry(country);
                  }}
                  placeholder={t(`userDashboard.tax.selectCountry`)}
                  textSize="sm"
                  className="mb-2"
                />
                {selectedCountryCode && (
                  <Link
                    to={`/visa-requirements/${selectedCountryCode.toLowerCase()}`}
                    className="text-sm underline"
                  >
                    {t("userDashboard.visaIndex.viewVisaFreeCountries")}
                  </Link>
                )}
              </div>
              <div>
                <label className="block mb-2 font-semibold uppercase text-sm">
                  {t("userDashboard.visaIndex.iWantToTravelTo")}
                </label>
                <CountryDropdown
                  value={selectedDestination}
                  onChange={(country) => {
                    handleInputChange("destination", country.alpha2);
                    setSelectedDestinationCode(country.alpha2);
                    setSelectedDestination(country);
                  }}
                  placeholder={t(`userDashboard.tax.selectCountry`)}
                  textSize="sm"
                  className="mb-2"
                />
                {selectedDestinationCode && (
                  <Link
                    to={`/visa-requirements/${selectedDestinationCode.toLowerCase()}`}
                    className="text-sm underline"
                  >
                    {t("userDashboard.visaIndex.viewVisaFreeCountries")}
                  </Link>
                )}
              </div>
              <div className="flex items-center">
                <Button
                  disabled={
                    checkLoading || !selectedCountry || !selectedDestination
                  }
                  variant="primary"
                  onClick={() => checkVisaRequirements()}
                  className="bg-[#c6952c] text-white h-[58px] w-full text-md font-semibold cursor-pointer text-wrap"
                >
                  {checkLoading
                    ? t("userDashboard.visaIndex.checking")
                    : t("userDashboard.visaIndex.checkIfYouNeedVisa")}
                </Button>
              </div>
            </div>

            {/* Main ticket container */}
            {visaInfo && (
              <div
                className="border border-[#E0E0E0] rounded-[23px] py-[30px] px-[35px] lg:px-[45px] flex items-center relative mt-10"
                style={{
                  background:
                    "radial-gradient(58.53% 2558.87% at 50.19% 43.62%, rgba(255, 255, 255, 0.58) 35.01%, rgba(230, 94, 56, 0.22) 100%), #FFFFFF",
                }}
              >
                {/* Left arrow icon */}
                <div
                  className={`left-[-3px] w-fit absolute ${
                    screenMaxWidth <= 768 ? "scale-x-[150%] scale-y-[200%]" : ""
                  }`}
                >
                  <svg
                    className="w-[24px] h-[40px] md:h-[68px]"
                    viewBox="0 0 24 69"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.4944 49.5C3.49442 62.5 3.99445 64 2.49445 68.5C1.66112 43.8333 0.29445 -4.19998 1.49445 1.00001C2.99445 7.50001 9.99445 15 16.4944 21C22.9944 27 29.4945 36.5 16.4944 49.5Z"
                      fill="#E0E0E0"
                    ></path>
                    <path
                      d="M15.4944 49.5C2.49442 62.5 2.99445 64 1.49445 68.5C0.661117 43.8333 -0.70555 -4.19998 0.49445 1.00001C1.99445 7.50001 8.99445 15 15.4944 21C21.9944 27 28.4945 36.5 15.4944 49.5Z"
                      fill="#FBF4F2"
                    ></path>
                    <path
                      d="M3.0607e-05 68.9999L3.0607e-05 0.499958H0.500031L1.00003 2.7261L1.50003 3.99996L1.50003 68.9999H3.0607e-05Z"
                      fill="#FBF4F2"
                    ></path>
                  </svg>
                </div>

                <div className="w-full flex justify-between flex-col gap-[15px] lg:flex-row lg:gap-0">
                  {/* First section */}
                  <div className="flex flex-col gap-y-[5px] pt-0 w-full order-1 lg:gap-y-[15px] lg:pt-[20px] justify-center lg:w-[23%] lg:order-none">
                    <div className="bg-white rounded-md p-[10px] lg:py-[10px] lg:px-[15px] flex lg:flex-col items-center gap-[10px] w-full font-semibold text-center">
                      <CircleFlag
                        countryCode={selectedCountryCode.toLowerCase()}
                        height={20}
                        width={screenMaxWidth <= 768 ? 25 : 40}
                      />
                      {getCountryName(visaInfo.code, selectedLanguage?.code)}
                    </div>
                  </div>

                  {/* Middle section */}
                  <div className="flex flex-col order-0 w-full order-0 items-start lg:w-[50%] lg:justify-around lg:items-center lg:order-none">
                    {/* Desktop arrow svg */}
                    <div className="relative hidden lg:block w-full">
                      <svg
                        className="block w-full"
                        width="821"
                        height="78"
                        viewBox="0 0 821 78"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 68.9999C8 68.9999 174.483 26.5918 409.163 24.0953C643.843 21.5989 813 69 813 69"
                          stroke="#231204"
                          strokeOpacity="0.27"
                          strokeWidth="2"
                          strokeDasharray="5 5"
                        ></path>
                        <circle
                          cx="8"
                          cy="70"
                          r="7.5"
                          stroke="#231204"
                          strokeOpacity="0.52"
                        ></circle>
                        <circle cx="8" cy="70" r="6" fill="#2D1004"></circle>
                        <circle
                          cx="813"
                          cy="70"
                          r="7.5"
                          stroke="#231204"
                          strokeOpacity="0.52"
                        ></circle>
                        <circle cx="813" cy="70" r="6" fill="#2D1004"></circle>
                        <circle cx="410" cy="24" r="24" fill="white"></circle>
                        <circle
                          cx="410"
                          cy="24"
                          r="23.5"
                          stroke="#231204"
                          strokeOpacity="0.27"
                          strokeLinecap="round"
                          strokeDasharray="5 5"
                        ></circle>
                        <path
                          d="M424.809 23.6041C424.777 23.559 424.002 22.4922 422.631 22.2113C421.388 21.9568 418.553 21.9424 418.433 21.9419C418.238 21.9413 418.058 21.9268 417.973 21.9158C417.891 21.8488 417.724 21.6849 417.614 21.549L412.052 14.6779C411.931 14.5294 411.687 14.2495 411.531 14.1423C411.264 13.9583 410.581 14.0032 410.505 14.0089L410.353 14.0201C410.147 14.0355 409.774 14.0767 409.597 14.1808C409.492 14.2424 409.172 14.43 409.467 15.341C409.467 15.341 411.587 21.8799 411.595 21.9088C411.564 21.9106 408.546 21.9117 408.546 21.9117C408.346 21.9117 408.163 21.8978 408.078 21.8872C407.994 21.8232 407.82 21.6609 407.706 21.5267L405.744 19.2187C405.73 19.2025 405.403 18.8198 405.197 18.6941C404.92 18.5261 404.389 18.6119 404.384 18.6129C404.232 18.6412 404.019 18.7133 403.884 18.8104C403.64 18.9857 403.599 19.3698 403.761 19.9518C404.202 21.5313 404.83 23.8728 404.877 24.2312C404.83 24.5896 404.202 26.9311 403.761 28.5106C403.727 28.634 403.617 29.054 403.651 29.2721C403.721 29.7205 404.357 29.8445 404.384 29.8496C404.542 29.8793 404.758 29.8887 404.897 29.8722C405.228 29.8322 405.661 29.3415 405.744 29.2437L407.706 26.9355C407.833 26.7855 407.962 26.6558 408.024 26.5992C408.128 26.5777 408.366 26.5507 408.546 26.5507C408.546 26.5507 411.564 26.5512 411.594 26.5521C411.586 26.5827 409.467 33.1214 409.467 33.1214C409.403 33.3178 409.301 33.6776 409.329 33.8804C409.374 34.2063 409.719 34.3952 410.354 34.4423L410.505 34.4535C410.601 34.4606 410.743 34.4677 410.883 34.4677C411.022 34.4677 411.16 34.4609 411.252 34.4412C411.568 34.373 412.003 33.8445 412.052 33.7845L417.614 26.9135C417.737 26.762 417.861 26.6304 417.922 26.5708C418.026 26.5486 418.258 26.5212 418.433 26.5205C418.553 26.52 421.388 26.5056 422.631 26.2511C424.002 25.97 424.777 24.9034 424.81 24.8581C425.065 24.5006 425.065 23.9616 424.809 23.6041Z"
                          fill="#E65E38"
                        ></path>
                        <path
                          d="M400.98 19.8906H398.649C398.152 19.8906 397.75 20.2976 397.75 20.7997C397.75 21.3017 398.152 21.7089 398.649 21.7089H400.98C401.476 21.7089 401.879 21.3017 401.879 20.7997C401.879 20.2976 401.476 19.8906 400.98 19.8906Z"
                          fill="#E65E38"
                        ></path>
                        <path
                          d="M400.98 26.9844H398.649C398.152 26.9844 397.75 27.3913 397.75 27.8933C397.75 28.3954 398.152 28.8024 398.649 28.8024H400.98C401.476 28.8024 401.879 28.3954 401.879 27.8933C401.879 27.3913 401.476 26.9844 400.98 26.9844Z"
                          fill="#E65E38"
                        ></path>
                        <path
                          d="M400.981 23.4375H395.899C395.403 23.4375 395 23.8447 395 24.3466C395 24.8488 395.403 25.2557 395.899 25.2557H400.981C401.477 25.2557 401.88 24.8488 401.88 24.3466C401.88 23.8447 401.477 23.4375 400.981 23.4375Z"
                          fill="#E65E38"
                        ></path>
                      </svg>
                    </div>
                    <div className="lg:w-[90%]">
                      <h1 className="font-extrabold uppercase text-start text-[20px] lg:text-center text-primary lg:text-[25px]">
                        {visaInfo.visa_required.some(
                          (c) => c.code === selectedDestinationCode
                        )
                          ? t("userDashboard.visaIndex.visaIsRequired")
                          : visaInfo.visa_online.some(
                              (c) => c.code === selectedDestinationCode
                            )
                          ? t("userDashboard.visaIndex.eVisaIsRequired")
                          : visaInfo.visa_on_arrival.some(
                              (c) => c.code === selectedDestinationCode
                            )
                          ? t("userDashboard.visaIndex.visaOnArrivalIsRequired")
                          : visaInfo.visa_free_access.some(
                              (c) => c.code === selectedDestinationCode
                            )
                          ? t("userDashboard.visaIndex.visaFree")
                          : visaInfo.electronic_travel_authorisation.some(
                              (c) => c.code === selectedDestinationCode
                            )
                          ? t("userDashboard.visaIndex.etaRequired")
                          : visaInfo.no_admission.some(
                              (c) => c.code === selectedDestinationCode
                            )
                          ? t("userDashboard.visaIndex.noAdmission")
                          : t("userDashboard.visaIndex.noDataAvailable")}
                      </h1>{" "}
                      <p className="font-bold text-start m-0 text-[16px] lg:text-center text-primary">
                        {t("userDashboard.visaIndex.forCitizensOf")}{" "}
                        {getCountryName(visaInfo.code, selectedLanguage.code)}{" "}
                        {t("userDashboard.visaIndex.toTravelTo")}{" "}
                        {getCountryName(
                          selectedDestinationCode,
                          selectedLanguage.code
                        )}
                      </p>{" "}
                    </div>
                  </div>

                  {/* Mobile arrow svg */}
                  <div className="block order-2 lg:hidden w-full">
                    <svg
                      width="30"
                      height="60"
                      viewBox="0 0 24 47"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 0C12 0 12 7.16996 12 22.9498C12 38.7297 12 47 12 47"
                        stroke="#231204"
                        strokeOpacity="0.27"
                        strokeDasharray="5 5"
                      ></path>
                      <circle
                        cx="11.6014"
                        cy="23.6014"
                        r="9"
                        transform="rotate(20.7124 11.6014 23.6014)"
                        fill="white"
                      ></circle>
                      <circle
                        cx="11.6014"
                        cy="23.6014"
                        r="8.75"
                        transform="rotate(20.7124 11.6014 23.6014)"
                        stroke="#231204"
                        strokeOpacity="0.27"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                      ></circle>
                      <path
                        d="M16.8431 23.56C16.832 23.5445 16.5648 23.1768 16.0923 23.0801C15.6639 22.9924 14.687 22.9874 14.6457 22.9872C14.5785 22.987 14.5165 22.982 14.4871 22.9782C14.4588 22.9551 14.4013 22.8987 14.3634 22.8518L12.4465 20.4839C12.4051 20.4327 12.3207 20.3363 12.2671 20.2994C12.1753 20.2359 11.9399 20.2514 11.9134 20.2534L11.8613 20.2572C11.7902 20.2625 11.6618 20.2767 11.6006 20.3126C11.5643 20.3338 11.454 20.3985 11.5558 20.7124C11.5558 20.7124 12.2863 22.9659 12.2892 22.9758C12.2784 22.9764 11.2384 22.9768 11.2384 22.9768C11.1697 22.9768 11.1064 22.972 11.0771 22.9684C11.0482 22.9463 10.9881 22.8904 10.9488 22.8441L10.2728 22.0488C10.268 22.0432 10.1554 21.9113 10.0843 21.868C9.98897 21.8101 9.8059 21.8397 9.80409 21.84C9.75187 21.8498 9.67836 21.8746 9.63182 21.908C9.5479 21.9685 9.53362 22.1008 9.58954 22.3014C9.74138 22.8457 9.95797 23.6526 9.97399 23.7762C9.95797 23.8997 9.7413 24.7066 9.58954 25.2509C9.57771 25.2934 9.53985 25.4382 9.55152 25.5133C9.5755 25.6678 9.79478 25.7106 9.80409 25.7123C9.85875 25.7226 9.93313 25.7258 9.98085 25.7201C10.0951 25.7063 10.2441 25.5372 10.2728 25.5035L10.9488 24.7081C10.9928 24.6564 11.0373 24.6117 11.0587 24.5922C11.0943 24.5848 11.1765 24.5755 11.2384 24.5755C11.2384 24.5755 12.2786 24.5756 12.2889 24.576C12.2861 24.5865 11.5559 26.8399 11.5559 26.8399C11.5339 26.9075 11.4985 27.0315 11.5082 27.1014C11.5238 27.2137 11.6426 27.2788 11.8613 27.2951L11.9134 27.2989C11.9465 27.3014 11.9954 27.3038 12.0439 27.3038C12.0918 27.3038 12.1392 27.3015 12.1709 27.2947C12.2799 27.2712 12.4299 27.089 12.4466 27.0684L14.3635 24.7005C14.4057 24.6483 14.4485 24.6029 14.4697 24.5824C14.5054 24.5748 14.5854 24.5653 14.6457 24.5651C14.687 24.5649 15.664 24.5599 16.0923 24.4722C16.5649 24.3754 16.8321 24.0078 16.8432 23.9922C16.9311 23.869 16.9311 23.6832 16.8431 23.56Z"
                        fill="#E65E38"
                      ></path>
                      <path
                        d="M8.63089 22.2816H7.82769C7.65661 22.2816 7.51794 22.4218 7.51794 22.5949C7.51794 22.7678 7.65661 22.9081 7.82769 22.9081H8.63089C8.80197 22.9081 8.94072 22.7678 8.94072 22.5949C8.94072 22.4218 8.80197 22.2816 8.63089 22.2816Z"
                        fill="#E65E38"
                      ></path>
                      <path
                        d="M8.63089 24.7243H7.82769C7.65661 24.7243 7.51794 24.8645 7.51794 25.0375C7.51794 25.2106 7.65661 25.3508 7.82769 25.3508H8.63089C8.80197 25.3508 8.94072 25.2106 8.94072 25.0375C8.94072 24.8645 8.80197 24.7243 8.63089 24.7243Z"
                        fill="#E65E38"
                      ></path>
                      <path
                        d="M8.63534 23.5029H6.88405C6.71296 23.5029 6.57422 23.6433 6.57422 23.8162C6.57422 23.9893 6.71296 24.1295 6.88405 24.1295H8.63534C8.80642 24.1295 8.94516 23.9893 8.94516 23.8162C8.94516 23.6433 8.80642 23.5029 8.63534 23.5029Z"
                        fill="#E65E38"
                      ></path>
                    </svg>
                  </div>

                  {/* Last section */}
                  <div className="flex flex-col pt-[20px] gap-y-[5px] order-3 items-start font-semibold w-full  lg:items-end justify-center lg:w-[23%] lg:gap-y-[15px] lg:-order-none">
                    <div className="bg-white rounded-md p-[10px] lg:py-[10px] lg:px-[15px] flex lg:flex-col items-center gap-[10px] w-full text-center">
                      <CircleFlag
                        countryCode={selectedDestinationCode.toLowerCase()}
                        height={20}
                        width={screenMaxWidth >= 768 ? 40 : 25}
                      />
                      {getCountryName(
                        selectedDestinationCode,
                        selectedLanguage?.code
                      )}
                    </div>
                  </div>
                </div>

                {/* Right arrow icon */}
                <div
                  className={`right-[-3px] w-fit absolute ${
                    screenMaxWidth <= 768 ? "scale-x-[150%] scale-y-[200%]" : ""
                  }`}
                >
                  <svg
                    className="w-[24px] h-[40px] md:h-[68px]"
                    viewBox="0 0 24 69"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.50558 20C20.5056 6.99997 20.0056 5.49998 21.5056 0.999985C22.3389 25.6666 23.7056 73.7 22.5056 68.5C21.0056 62 14.0056 54.5 7.50558 48.5C1.00558 42.5 -5.49445 33 7.50558 20Z"
                      fill="#E0E0E0"
                    ></path>
                    <path
                      d="M8.50558 20C21.5056 6.99997 21.0056 5.49998 22.5056 0.999985C23.3389 25.6666 24.7056 73.7 23.5056 68.5C22.0056 62 15.0056 54.5 8.50558 48.5C2.00558 42.5 -4.49445 33 8.50558 20Z"
                      fill="#FBF4F2"
                    ></path>
                    <path
                      d="M24 0.500072V69H23.5L23 66.7739L22.5 65.5V0.500072H24Z"
                      fill="#FBF4F2"
                    ></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-4">
          <div className="flex flex-col">
            <h2 className="font-semibold text-[2rem] leading-[1.2]">
              {t("userDashboard.visaIndex.faqs.title")}
            </h2>
            <p className="mt-2">{t("userDashboard.visaIndex.faqs.desc")}</p>
          </div>

          <div className="w-full">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {" "}
                  {t("userDashboard.visaIndex.faqs.question1")}
                </AccordionTrigger>
                <AccordionContent>
                  {t("userDashboard.visaIndex.faqs.answer1")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  {t("userDashboard.visaIndex.faqs.question2")}
                </AccordionTrigger>
                <AccordionContent>
                  {t("userDashboard.visaIndex.faqs.answer2")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  {t("userDashboard.visaIndex.faqs.question3")}
                </AccordionTrigger>
                <AccordionContent>
                  {t("userDashboard.visaIndex.faqs.answer3")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  {t("userDashboard.visaIndex.faqs.question4")}
                </AccordionTrigger>
                <AccordionContent>
                  {t("userDashboard.visaIndex.faqs.answer4")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  {t("userDashboard.visaIndex.faqs.question5")}
                </AccordionTrigger>
                <AccordionContent>
                  {t("userDashboard.visaIndex.faqs.answer5")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>
                  {t("userDashboard.visaIndex.faqs.question6")}
                </AccordionTrigger>
                <AccordionContent>
                  {t("userDashboard.visaIndex.faqs.answer6")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
