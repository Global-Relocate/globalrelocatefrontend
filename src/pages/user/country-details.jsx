import axios from "axios";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import swizerland from "../../assets/images/swizerland.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PiShare } from "react-icons/pi";
import { useCountryData } from "@/context/CountryDataContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmbassies } from "@/lib/embassies";
import { ChevronLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel-edited";
import Autoplay from "embla-carousel-autoplay";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { getCountryName, getCountryCode } from "@/data/country-translations";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { CountryAiChatProvider } from "@/context/CountryAIChatContext";
import CountriesAIAssistant from "@/components/common/countries-ai-assistant";
import { CarouselIndicators } from "@/lib/helpers";
import { loadCountryImages } from "@/lib/country-images";
import { formatTextToParagraphs } from "@/utils/formatText";
import { countriesQidFlags } from "@/data/countries-qid-flags";
import { getCountryCostOfLivingData } from "@/services/api";
import { formatGermanNumber } from "@/utils/formatGermanNumber";

const apiURL = import.meta.env.VITE_API_URL;

function CountryDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    singleCountry,
    loading,
    getSingleCountry,
    favourites,
    addCountryToFavourite,
    removeCountryFromFavourite,
  } = useCountryData();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState();
  const [count, setCount] = useState(0);
  const { selectedLanguage } = useLanguage();
  const [countryData, setCountryData] = useState(null);
  const [costOfLivingData, setCostOfLivingData] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [passportRanking, setPassportRanking] = useState();
  const [countryImages, setCountryImages] = useState({});
  const [countryEmbassies, setCountryEmbassies] = useState([]);

  useEffect(() => {
    if (id) {
      getSingleCountry(id, selectedLanguage.name);
    }
  }, [selectedLanguage.lang, id]);

  const fetchCostOfLiving = async (cityData) => {
    try {
      const costOfLivingData = await getCountryCostOfLivingData({
        country: id,
        city: cityData,
        lang: selectedLanguage?.lang.toLowerCase() || "en",
      });
      setCostOfLivingData(costOfLivingData.data[0]);
      // console.log("Cost of living data:", costOfLivingData.data[0]);
    } catch (error) {
      console.error("Error fetching cost of living data:", error);
    }
  };

  useEffect(() => {
    if (singleCountry) {
      setCountryData(singleCountry);
      fetchCostOfLiving(singleCountry?.keyFacts?.capital);
      setCountryCode(getCountryCode(singleCountry?.slug));
    }
  }, [singleCountry]);

  const fetchPassportRanking = async () => {
    try {
      const [response, visaFreeAccess] = await Promise.all([
        axios.get(`https://api.henleypassportindex.com/api/v2/hpp`),
        axios.get(
          `https://api.henleypassportindex.com/api/v3/visa-single/${countryCode.toLowerCase()}`,
        ),
      ]);

      // Find the specific country in the response
      const country = response.data.find((item) => item.code === countryCode);

      if (country && visaFreeAccess) {
        setPassportRanking({
          rank: country.hpp_rank,
          code: country.code,
          visaFreeCount: visaFreeAccess.data.visa_free_access?.length || 0,
          visaOnArrivalCount: visaFreeAccess.data.visa_on_arrival?.length || 0,
          etaCount:
            visaFreeAccess.data.electronic_travel_authorisation?.length || 0,
          visaRequiredCount: visaFreeAccess.data.visa_required?.length || 0,
          visaOnlineCount: visaFreeAccess.data.visa_online?.length || 0,
        });
      } else {
        setPassportRanking(null);
      }
    } catch (error) {
      console.error("Error fetching passport ranking:", error);
    }
  };

  useEffect(() => {
    if (countryCode) {
      fetchPassportRanking();
    }
  }, [countryCode]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this country!",
          text: "Get detailed information about relocating to this country on GlobalRelocate.",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast(t("toast.linkCopied"));
        })
        .catch((error) => {
          console.error("Failed to copy link:", error);
        });
    }
  };

  const checkFavorites = (id) => {
    if (favourites && favourites.length > 0) {
      return favourites.some((country) => country.countryId === id);
    } else {
      return false;
    }
  };

  const toggleFavorite = async (id) => {
    setFavoriteLoading(true);
    if (checkFavorites(id)) {
      await removeCountryFromFavourite(id);
      setFavoriteLoading(false);
    } else {
      await addCountryToFavourite(id);
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrentIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!countryCode) return;
    loadCountryImages().then((images) => setCountryImages(images));
  }, [countryCode]);

  const fetchEmbassies = async () => {
    try {
      const languageCode = selectedLanguage?.code.slice(0, 2);
      const normalizedId = id.replace(/-/g, " ");
      const qid = countriesQidFlags[normalizedId]?.qid;
      const embassies = await getEmbassies(qid, languageCode);
      setCountryEmbassies(Array.isArray(embassies) ? embassies : []);
    } catch (error) {
      console.error("Error fetching embassies:", error);
    }
  };

  useEffect(() => {
    fetchEmbassies();
  }, [selectedLanguage?.code]);

  const continents = {
    Africa: t("userDashboard.continents.africa"),
    Antarctica: t("userDashboard.continents.antarctica"),
    Asia: t("userDashboard.continents.asia"),
    Europe: t("userDashboard.continents.europe"),
    "North America": t("userDashboard.continents.northAmerica"),
    Oceania: t("userDashboard.continents.oceania"),
    "South America": t("userDashboard.continents.southAmerica"),
  };

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ChevronLeft size={20} />
        <span>{t("userDashboard.country.back")}</span>
      </button>

      <div className="flex w-full gap-3 flex-wrap items-center justify-between">
        {loading ? (
          <>
            <div className="flex items-start gap-2">
              <Skeleton className="w-9 h-9 rounded-full" />

              <div className="space-y-3">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-2">
              <img
                src={
                  countryData?.name === "Afghanistan"
                    ? "https://flagcdn.com/w320/af.png"
                    : countryData?.keyFacts?.flag
                }
                className="w-10 h-10 rounded-full object-cover"
                alt="Country flag"
              />
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-medium">
                  {getCountryName(
                    countryData?.slug,
                    selectedLanguage?.code || "deu",
                  )}
                </h2>
                <span>
                  {t("userDashboard.country.countryIn")}{" "}
                  {continents[countryData?.continent] || countryData?.continent}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-3xl border"
                onClick={() => toggleFavorite(countryData?.id)}
                disabled={favoriteLoading}
              >
                {checkFavorites(countryData?.id) ? (
                  <>
                    <i className="fas fa-heart text-destructive mr-2" />
                    {t("userDashboard.country.removeFavorite")}
                  </>
                ) : (
                  <>
                    <i className="far fa-heart mr-2" />
                    {t("userDashboard.country.addFavorite")}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="rounded-3xl border"
                onClick={() => handleShare()}
              >
                {" "}
                <PiShare /> {t("userDashboard.country.share")}
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="w-full rounded-2xl">
        {loading ? (
          <>
            <Skeleton className="w-full h-full mt-5 rounded-2xl" />
            <Skeleton className="w-full h-[450px] mt-5 rounded-2xl" />
          </>
        ) : (
          <>
            {countryImages &&
            countryImages[getCountryCode(countryData?.slug)] ? (
              <Carousel
                opts={{
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 5000,
                  }),
                ]}
                className="w-full rounded-2xl overflow-hidden"
                setApi={setApi}
              >
                <CarouselContent className="rounded-2xl">
                  {countryImages[getCountryCode(countryData.slug)]?.map(
                    (item, i) => (
                      <CarouselItem key={i} className="rounded-2xl pb-6">
                        <img
                          src={item}
                          alt="Country"
                          className="w-full h-full mt-5 rounded-2xl object-cover"
                        />
                      </CarouselItem>
                    ),
                  )}
                </CarouselContent>
                <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden">
                  <CarouselPrevious className="absolute left-0 h-full w-[60px] rounded-none bg-transparent border-0 hover:bg-transparent" />
                  <CarouselNext className="absolute right-0 h-full w-[60px] rounded-none bg-transparent border-0 hover:bg-transparent" />
                </div>
                <CarouselIndicators
                  currentIndex={currentIndex}
                  total={count}
                  onClick={(index) => api?.scrollTo(index)}
                />
              </Carousel>
            ) : (
              <>
                <img
                  src={swizerland}
                  className="w-full h-full object-cover object-center mt-5 rounded-xl"
                  alt="country image"
                />
              </>
            )}

            {countryData && (
              <Tabs defaultValue="overview" className="mt-5">
                <TabsList className="flex overflow-x-auto overflow-y-hidden w-full justify-start gap-2 bg-white whitespace-nowrap pb-1">
                  <TabsTrigger
                    value="overview"
                    className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
                  >
                    {t("userDashboard.country.overview")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="visa"
                    className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
                  >
                    {t("userDashboard.country.visaMigration")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="embassies"
                    className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
                  >
                    {t("userDashboard.country.embassies")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="taxes"
                    className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
                  >
                    {t("userDashboard.country.taxes")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai-assistant"
                    className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
                  >
                    {t("userDashboard.ai.title")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <h2 className="font-medium text-2xl my-7">
                    <i className="far fa-note mr-2" />{" "}
                    {getCountryName(countryData?.slug, selectedLanguage.code)}{" "}
                    {t("userDashboard.country.overview")}
                  </h2>
                  <div className="text-[#222222] prose prose-md max-w-none leading-relaxed">
                    {countryData.overview === "No overview available"
                      ? t("userDashboard.country.noOverview")
                      : formatTextToParagraphs(countryData.overview)}
                  </div>

                  <div className="mt-20 mb-6">
                    <hr />
                    <div className="my-5">
                      <h2 className="text-2xl mt-2 mb-8">
                        {t("userDashboard.country.keyFacts")}
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.flag")}
                          </h3>
                          <p>
                            <img
                              src={
                                countryData?.name === "Afghanistan"
                                  ? "https://flagcdn.com/w320/af.png"
                                  : countryData?.keyFacts?.flag ||
                                    "https://flagcdn.com/w320/ci.png"
                              }
                              className="w-6 h-6 rounded-full object-cover"
                              alt="Country flag"
                            />
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.capital")}
                          </h3>
                          <p className="text-md">
                            {countryData.keyFacts?.capital || "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.languages")}
                          </h3>
                          <p className="text-md">
                            {countryData.keyFacts?.languages?.join(", ") ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.currency")}
                          </h3>
                          <p className="text-md">
                            {countryData.keyFacts?.currency?.full
                              ? `${countryData.keyFacts.currency.full} (${countryData.keyFacts.currency.abbreviation})`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.population")}
                          </h3>
                          <p className="text-md">
                            {countryData.keyFacts?.population?.inNumbers
                              ? parseInt(
                                  countryData.keyFacts.population.inNumbers,
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.dialingCode")}
                          </h3>
                          <p className="text-md">
                            {countryData.keyFacts?.dialingCode || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="mt-8 mb-6">
                      <div className="my-5">
                        <h3 className="text-md font-semibold mb-3">
                          <i className="far fa-signal mr-2" />{" "}
                          {t("userDashboard.country.internetSpeed")}
                        </h3>
                        <div className="mt-8">
                          <p>
                            {formatTextToParagraphs(
                              countryData.CountryAdditionalInfo.internetSpeed,
                            ) ?? t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-train mr-2" />{" "}
                            {t(
                              "userDashboard.country.publicTransportEfficiency",
                            )}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo
                              .publicTransportEfficiency
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo
                                    .publicTransportEfficiency,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-school mr-2" />{" "}
                            {t("userDashboard.country.compulsorySchooling")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo
                              .compulsorySchooling &&
                            countryData.CountryAdditionalInfo
                              .compulsorySchooling !== "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo
                                    .compulsorySchooling,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-school mr-2" />{" "}
                            {t("userDashboard.country.homeSchooling")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo.homeschooling &&
                            countryData.CountryAdditionalInfo.homeSchooling !==
                              "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo
                                    .homeschooling,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-cat mr-2" />{" "}
                            {t("userDashboard.country.animalTransport")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo
                              .animalTransport &&
                            countryData.CountryAdditionalInfo
                              .animalTransport !== "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo
                                    .animalTransport,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-star-of-life mr-2" />{" "}
                            {t("userDashboard.country.quarantine")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo.quarantine &&
                            countryData.CountryAdditionalInfo.quarantine !==
                              "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo.quarantine,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-syringe mr-2" />{" "}
                            {t("userDashboard.country.vaccinationRequirements")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo
                              .vaccinationRequirements &&
                            countryData.CountryAdditionalInfo
                              .vaccinationRequirements !== "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo
                                    .vaccinationRequirements,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-files mr-2" />{" "}
                            {t("userDashboard.country.necessaryDocuments")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo
                              .necessaryDocuments &&
                            countryData.CountryAdditionalInfo
                              .necessaryDocuments !== "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo
                                    .necessaryDocuments,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-train mr-2" />{" "}
                            {t("userDashboard.country.transportCosts")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo.transportCosts &&
                            countryData.CountryAdditionalInfo.transportCosts !==
                              "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo
                                    .transportCosts,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-graduation-cap mr-2" />{" "}
                            {t("userDashboard.country.education")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo.education &&
                            countryData.CountryAdditionalInfo.education !==
                              "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo.education,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-soccer-ball mr-2" />{" "}
                            {t("userDashboard.country.sport")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo.sport &&
                            countryData.CountryAdditionalInfo.sport !==
                              "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo.sport,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-music mr-2" />{" "}
                            {t("userDashboard.country.music")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo.music &&
                            countryData.CountryAdditionalInfo.music !==
                              "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo.music,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-spa mr-2" />{" "}
                            {t("userDashboard.country.adaptation")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo.adaptation &&
                            countryData.CountryAdditionalInfo.adaptation !==
                              "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo.adaptation,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-user mr-2" />{" "}
                            {t("userDashboard.country.racism")}
                          </h3>
                          <p>
                            {countryData.CountryAdditionalInfo.racism &&
                            countryData.CountryAdditionalInfo.racism !==
                              "Unknown"
                              ? formatTextToParagraphs(
                                  countryData.CountryAdditionalInfo.racism,
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>

                  <div className="mt-20 mb-6">
                    <div className="my-5">
                      <h2 className="text-2xl mt-2 mb-8">
                        <i className="far fa-map mr-2" />{" "}
                        {t("userDashboard.country.map")}
                      </h2>
                      <div className="rounded-2xl w-full">
                        <iframe
                          src={`https://maps.google.com/maps?q=${
                            countryData.name
                          }&hl=en&z=${
                            countryData.slug === "canada" ? 3 : 5
                          }&maptype=satellite&output=embed`}
                          className="w-full h-[450px] rounded-3xl outline-none"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                    <hr />
                  </div>

                  <div className="mt-20 mb-6">
                    <div className="my-5">
                      <h2 className="text-2xl mt-2 mb-8">
                        <i className="far fa-spa mr-2" />{" "}
                        {t("userDashboard.country.qualityOfLife")}
                      </h2>
                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.summary")}
                        </h3>
                        <p>
                          {countryData.CountryAdditionalInfo.qualityOfLife ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>

                  <div className="mt-20 mb-6">
                    <div className="my-5">
                      <h2 className="text-2xl mt-2 mb-8">
                        <i className="far fa-user-tie mr-2" />{" "}
                        {t("userDashboard.country.costOfLiving")}
                      </h2>
                      <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.averageCost")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.avgCosts ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.mostExpensiveCity")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.mostExpensiveCity ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.cheapestCity")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.cheapestCity ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.mostExpensiveStates")}
                        </h3>
                        <p>
                          {countryData.mostExpensiveStates
                            ? countryData.mostExpensiveStates.map(
                                (state, index) => (
                                  <div key={index} className="my-2">
                                    <h3 className="font-semibold">
                                      {index + 1}.{" "}
                                      <span className="ml-1">{state.name}</span>
                                    </h3>
                                    {state.details && (
                                      <p className="ml-[22px]">
                                        - {state.details}
                                      </p>
                                    )}
                                  </div>
                                ),
                              )
                            : t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-8">
                        {costOfLivingData &&
                        typeof costOfLivingData === "object" &&
                        Object.keys(costOfLivingData).length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-semibold capitalize">
                                  {t("userDashboard.country.category")}
                                </TableHead>
                                <TableHead className="font-semibold capitalize">
                                  {t("userDashboard.country.value")} (EUR)
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(costOfLivingData)
                                .filter(
                                  ([key]) =>
                                    ![
                                      "city",
                                      "country",
                                      "data_quality",
                                      "Unnamed: 0",
                                    ].includes(key),
                                )
                                .map(([key, value], index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-semibold">
                                      {t(`${key}`)}
                                    </TableCell>
                                    <TableCell>
                                      {value &&
                                        `€${formatGermanNumber(
                                          (value * 0.87).toFixed(2),
                                          selectedLanguage,
                                        )}`}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p>{t("userDashboard.country.noDataAvailable")}</p>
                        )}
                      </div>

                      {/* <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.rentPerMonth")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.rentPerMonth ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.howToFindApartment")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.howToFindApartment ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.food")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.food ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.mobilePhonePlan")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.mobilePhonePlan ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.childCare")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.childCare ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div> */}
                    </div>
                    <hr />
                  </div>

                  <div className="mt-20 mb-6">
                    <div className="my-5">
                      <h2 className="text-2xl mt-2 mb-8">
                        <i className="far fa-suitcase mr-2" />{" "}
                        {t("userDashboard.country.workLifeBalance")}
                      </h2>
                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.summary")}
                        </h3>
                        <p>
                          {countryData.CountryAdditionalInfo.workLifeBalance ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>

                  <div className="mt-20 mb-6">
                    <div className="my-5">
                      <h2 className="text-2xl mt-2 mb-8">
                        <i className="far fa-face-smile-relaxed mr-2" />{" "}
                        {t("userDashboard.country.worldHappinessIndex")}
                      </h2>
                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.summary")}
                        </h3>
                        <p>
                          {countryData.CountryAdditionalInfo
                            .worldHappinessIndex ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.whiScore")}
                        </h3>
                        <p>
                          {countryData.CountryAdditionalInfo
                            .worldHappinessIndexScore
                            ? `${countryData.CountryAdditionalInfo.worldHappinessIndexScore}/10`
                            : t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>
                </TabsContent>

                <TabsContent value="visa">
                  <h2 className="font-medium text-2xl my-7">
                    {t("userDashboard.country.visaAndImmigration")}
                  </h2>
                  {countryData.visaAndImmigration?.summary !==
                    "No data available" && (
                    <div className="space-y-4">
                      {countryData.visaAndImmigration?.passportsAndVisas && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-passport"></i>{" "}
                            {t("userDashboard.country.passportAndVisas")}
                          </h3>
                          <p>
                            {countryData.visaAndImmigration.passportsAndVisas}
                          </p>

                          <div className="mt-10">
                            <h3 className="font-semibold text-lg">
                              {t("userDashboard.visaIndex.passportRanking")}
                            </h3>
                            <div className="flex items-center justify-start gap-x-6 flex-wrap gap-y-2">
                              <div className="rounded-lg h-[250px] w-[180px] my-5">
                                <img
                                  src={`${apiURL}/image/fetch/${countryCode.toLowerCase()}`}
                                  alt={countryData?.slug}
                                  className="w-full h-full"
                                />
                              </div>

                              <div>
                                <p>
                                  <h3 className="font-medium text-lg">
                                    {t("userDashboard.visaIndex.rank")}{" "}
                                    {passportRanking?.rank} (
                                    <Link
                                      to={`/visa-requirements/${countryCode.toLowerCase()}`}
                                      className="hover:underline hover:underline-offset-4"
                                    >
                                      {t("userDashboard.countries.view")}
                                    </Link>
                                    )
                                  </h3>
                                </p>
                                <p>
                                  {t(
                                    "userDashboard.visaIndex.visaFreeDestinations",
                                  )}{" "}
                                  -{" "}
                                  <span className="font-semibold">
                                    {passportRanking?.visaFreeCount}{" "}
                                    {t("userDashboard.countries.title")}
                                  </span>{" "}
                                  (
                                  <Link
                                    to={`/visa-requirements/${countryCode.toLowerCase()}#visa-free`}
                                    className="hover:underline hover:underline-offset-4"
                                  >
                                    {t("userDashboard.countries.view")}
                                  </Link>
                                  )
                                </p>
                                <p>
                                  {t(
                                    "userDashboard.visaIndex.visaRequiredDestinations",
                                  )}{" "}
                                  -{" "}
                                  <span className="font-semibold">
                                    {passportRanking?.visaRequiredCount}{" "}
                                    {t("userDashboard.countries.title")}
                                  </span>{" "}
                                  (
                                  <Link
                                    to={`/visa-requirements/${countryCode.toLowerCase()}#visa-required`}
                                    className="hover:underline hover:underline-offset-4"
                                  >
                                    {t("userDashboard.countries.view")}
                                  </Link>
                                  )
                                </p>
                                <p>
                                  {t(
                                    "userDashboard.visaIndex.visaOnArrivalDestinations",
                                  )}{" "}
                                  -{" "}
                                  <span className="font-semibold">
                                    {passportRanking?.visaOnArrivalCount}{" "}
                                    {t("userDashboard.countries.title")}
                                  </span>{" "}
                                  (
                                  <Link
                                    to={`/visa-requirements/${countryCode.toLowerCase()}#visa-on-arrival`}
                                    className="hover:underline hover:underline-offset-4"
                                  >
                                    {t("userDashboard.countries.view")}
                                  </Link>
                                  )
                                </p>
                                <p>
                                  {t("userDashboard.visaIndex.etaDestinations")}{" "}
                                  -{" "}
                                  <span className="font-semibold">
                                    {passportRanking?.etaCount}{" "}
                                    {t("userDashboard.countries.title")}
                                  </span>{" "}
                                  (
                                  <Link
                                    to={`/visa-requirements/${countryCode.toLowerCase()}#eta`}
                                    className="hover:underline hover:underline-offset-4"
                                  >
                                    {t("userDashboard.countries.view")}
                                  </Link>
                                  )
                                </p>
                                <p>
                                  {t(
                                    "userDashboard.visaIndex.visaOnlineDestinations",
                                  )}{" "}
                                  -{" "}
                                  <span className="font-semibold">
                                    {passportRanking?.visaOnlineCount}{" "}
                                    {t("userDashboard.countries.title")}
                                  </span>{" "}
                                  (
                                  <Link
                                    to={`/visa-requirements/${countryCode.toLowerCase()}#e-visa`}
                                    className="hover:underline hover:underline-offset-4"
                                  >
                                    {t("userDashboard.countries.view")}
                                  </Link>
                                  )
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {countryData.visaAndImmigration?.visaTypes && (
                        <div className="mt-12">
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-passport"></i>{" "}
                            {t("userDashboard.country.visaTypes")}
                          </h3>

                          {countryData.visaAndImmigration.visaTypes.length ===
                          0 ? (
                            <p>{t("userDashboard.country.noDataAvailable")}</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                              {countryData.visaAndImmigration.visaTypes.map(
                                (visa, index) => (
                                  <div
                                    key={index}
                                    className="my-2 rounded-md border border-black p-3"
                                  >
                                    <h3 className="font-semibold">
                                      {index + 1}.{" "}
                                      <span className="ml-1">{visa.name}</span>
                                    </h3>
                                    <p>{visa.description}</p>

                                    <div className="flex flex-wrap items-center gap-x-5 mt-2">
                                      <span>
                                        <i className="far fa-calendar mr-1"></i>{" "}
                                        {visa.duration}
                                      </span>
                                      <span>
                                        <i className="far fa-money-bill-wave mr-2"></i>
                                        {visa.priceRange}
                                      </span>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {countryData.visaAndImmigration?.visaRequirements && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-passport"></i>{" "}
                            {t("userDashboard.country.visaRequirements")}
                          </h3>

                          <p>
                            {countryData.visaAndImmigration.visaRequirements
                              .length > 0
                              ? countryData.visaAndImmigration.visaRequirements.map(
                                  (item, index) => (
                                    <div key={index} className="my-2">
                                      <h3 className="font-semibold">
                                        {index + 1}.{" "}
                                        <span className="ml-1">
                                          {item.title}
                                        </span>
                                      </h3>
                                      <p className="ml-[22px]">
                                        {item.description}
                                      </p>
                                    </div>
                                  ),
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>
                      )}

                      {countryData.visaAndImmigration?.applicationProcesses && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-passport"></i>{" "}
                            {t("userDashboard.country.visaApplication")}
                          </h3>

                          <p>
                            {countryData.visaAndImmigration.applicationProcesses
                              .length > 0
                              ? countryData.visaAndImmigration.applicationProcesses.map(
                                  (item, index) => (
                                    <div key={index} className="my-2">
                                      <h3 className="font-semibold">
                                        {index + 1}.{" "}
                                        <span className="ml-1">
                                          {item.title}
                                        </span>
                                      </h3>
                                      <p className="ml-[22px]">
                                        {item.description}
                                      </p>
                                    </div>
                                  ),
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>
                      )}

                      {countryData.visaAndImmigration?.shortStays && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-umbrella-beach"></i>{" "}
                            {t("userDashboard.country.shortStays")}
                          </h3>
                          <p>{countryData.visaAndImmigration.shortStays}</p>
                        </div>
                      )}

                      {countryData.visaAndImmigration?.longStays && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-suitcase"></i>{" "}
                            {t("userDashboard.country.longStays")}
                          </h3>
                          <p>{countryData.visaAndImmigration.longStays}</p>
                        </div>
                      )}

                      {countryData.visaAndImmigration?.obtainCitizenship && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-passport"></i>{" "}
                            {t("userDashboard.country.obtainCitizenship")}
                          </h3>
                          <p>
                            {countryData.visaAndImmigration.obtainCitizenship
                              .length > 0
                              ? countryData.visaAndImmigration.obtainCitizenship.map(
                                  (item, index) => (
                                    <div key={index} className="my-2">
                                      <h3 className="font-semibold">
                                        {index + 1}.{" "}
                                        <span className="ml-1">
                                          {item.title}
                                        </span>
                                      </h3>
                                      <p className="ml-[22px]">
                                        {item.description}
                                      </p>
                                    </div>
                                  ),
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>
                      )}
                      {!countryData.visaAndImmigration?.passportsAndVisas &&
                        !countryData.visaAndImmigration?.shortStays &&
                        !countryData.visaAndImmigration?.longStays && (
                          <p>{t("userDashboard.country.noVisaInfo")}</p>
                        )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="embassies">
                  <h2 className="font-medium text-2xl my-7">
                    <i className="far fa-plane-departure"></i>{" "}
                    {t("userDashboard.country.embassiesAndConsulates")}
                  </h2>
                  <div className="space-y-4 mb-4">
                    {countryData.visaAndImmigration?.embassies && (
                      <div>
                        {countryData.visaAndImmigration.embassies.length ===
                        0 ? (
                          <p className="capitalize">
                            {t("userDashboard.country.noDataAvailable")}
                          </p>
                        ) : (
                          <>
                            <ul className="list-disc [&>li]:mt-2 pl-5">
                              {Array.isArray(countryEmbassies) &&
                                countryEmbassies.map((embassy, index) => (
                                  <li key={index}>
                                    <div className="">
                                      <span className="capitalize flex flex-row items-center gap-5 w-fit px-5 bg-slate-200 rounded-lg">
                                        {/^Q\d+/.test(embassy.embassyLabel) &&
                                        countryData?.slug !== "qatar"
                                          ? // use owner id (Qid) or mapped name if available
                                            countriesQidFlags[
                                              embassy.owner
                                                ?.toLowerCase()
                                                .replace(/-/g, " ") ||
                                                embassy.owner
                                            ]?.name ||
                                            embassy.owner?.replace() ||
                                            embassy.owner
                                          : embassy.embassyLabel}
                                        {/* Determine owner key (support full URI like .../Q123 or raw id) */}
                                        <img
                                          src={(() => {
                                            const ownerKey =
                                              embassy.owner
                                                ?.toLowerCase()
                                                .replace(/-/g, " ") ||
                                              embassy.owner;
                                            return (
                                              countriesQidFlags[ownerKey]
                                                ?.flagUrl ||
                                              "https://flagandbuntingstore.co.uk/cdn/shop/files/white__69233.1738246337.1280.1280.jpg?v=1739974302&width=5000"
                                            );
                                          })()}
                                          alt={`${embassy.embassyLabel} flag`}
                                          className="w-6 h-4 object-cover inline-block"
                                        />
                                      </span>
                                    </div>
                                    {embassy.address &&
                                      embassy.address !== "â" && (
                                        <div>
                                          <span className="font-semibold">
                                            {t("userDashboard.country.address")}
                                            :
                                          </span>{" "}
                                          <span className="">
                                            {embassy.address}
                                          </span>
                                        </div>
                                      )}
                                    {embassy.website && (
                                      <div>
                                        <span className="font-semibold">
                                          {t("userDashboard.country.link")}:
                                        </span>{" "}
                                        <a
                                          href={embassy.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="underline underline-offset-4"
                                        >
                                          {embassy.website}
                                        </a>
                                      </div>
                                    )}
                                  </li>
                                ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="taxes">
                  <h2 className="font-medium text-2xl my-7">
                    {t("userDashboard.country.taxesAndFinances")}
                  </h2>
                  <div className="space-y-4 mb-4">
                    {countryData.taxAndFinance?.summary !==
                      "No data available" && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                          <i className="fal fa-info-circle"></i>
                          {t("userDashboard.country.summary")}
                        </h3>
                        <p>{countryData.taxAndFinance.summary}</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 space-y-3 md:space-y-0 md:space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                          <i className="fad fa-money-bill-transfer"></i>{" "}
                          {t("userDashboard.country.personalIncomeTax")}
                        </h3>
                        <p>
                          <span className="underline underline-offset-4 font-semibold">
                            {t("userDashboard.country.federalTax")}
                          </span>
                          <p className="mt-3">
                            {countryData.taxAndFinance?.federalRate ||
                              t("userDashboard.country.notApplicable")}
                          </p>
                        </p>
                        <p className="mt-3">
                          <span className="underline underline-offset-4 font-semibold">
                            {t("userDashboard.country.communalRate")}
                          </span>
                          <p className="mt-3">
                            {countryData.taxAndFinance?.communalRate ||
                              t("userDashboard.country.notApplicable")}
                          </p>
                        </p>
                      </div>
                      <div className="md:border-l md:pl-4">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                          <i className="fad fa-money-check"></i>{" "}
                          {t("userDashboard.country.corporateTax")}
                        </h3>
                        <p>
                          {countryData.taxAndFinance?.corporateTax ||
                            t("userDashboard.country.notApplicable")}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ai-assistant">
                  <div className="flex flex-col">
                    <h2 className="font-medium text-2xl my-2">
                      {t("userDashboard.ai.title")}
                    </h2>
                    <p>{t("userDashboard.ai.description")}</p>
                  </div>

                  <CountryAiChatProvider countrySlug={countryData?.slug}>
                    <CountriesAIAssistant
                      countryName={countryData?.name}
                      countrySlug={countryData?.slug}
                    />
                  </CountryAiChatProvider>
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CountryDetails;
