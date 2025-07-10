import DashboardLayout from "@/components/layouts/DashboardLayout";
import swizerland from "../../assets/images/swizerland.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PiShare } from "react-icons/pi";
import { useCountryData } from "@/context/CountryDataContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getCountryName } from "@/data/country-translations";
import { toast } from "sonner";

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
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getSingleCountry(id, selectedLanguage.name);
    }
  }, [selectedLanguage.name, id]);

  useEffect(() => {
    if (singleCountry) {
      setCountryData(singleCountry);
    }
  }, [singleCountry]);

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

  // Custom CarouselIndicators component
  const CarouselIndicators = ({ currentIndex, total, onClick }) => {
    return (
      <div className="flex absolute bottom-4 left-1/2 transform -translate-x-1/2 justify-center mt-2">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            className={`w-6 h-1 shadow rounded-md mx-1 ${
              currentIndex === index ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => onClick(index)}
          />
        ))}
      </div>
    );
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
                  {getCountryName(countryData?.slug, selectedLanguage.code)}
                </h2>
                <span>
                  {t("userDashboard.country.countryIn")}{" "}
                  {countryData?.continent}
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
            {countryData?.images.length > 0 ? (
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
                  {countryData.images.map((item, i) => {
                    return (
                      <CarouselItem key={i} className="rounded-2xl pb-6">
                        <img
                          src={item}
                          alt="Images"
                          className="w-full h-full mt-5 rounded-2xl"
                        />
                      </CarouselItem>
                    );
                  })}
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
                    value="taxes"
                    className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
                  >
                    {t("userDashboard.country.taxes")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <h2 className="font-medium text-2xl my-7">
                    <i className="far fa-note mr-2" />{" "}
                    {getCountryName(countryData?.slug, selectedLanguage.code)}{" "}
                    {t("userDashboard.country.overview")}
                  </h2>
                  <p className="text-[#222222]">
                    {countryData.overview === "No overview available"
                      ? t("userDashboard.country.noOverview")
                      : countryData.overview}
                  </p>

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
                                  countryData.keyFacts.population.inNumbers
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
                        <div className="mt-4">
                          <p>
                            {countryData.additionalInfo.internetSpeed ??
                              t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-md font-semibold mb-3">
                            <i className="far fa-train mr-2" />{" "}
                            {t(
                              "userDashboard.country.publicTransportEfficiency"
                            )}
                          </h3>
                          <p>
                            {countryData.additionalInfo
                              .publicTransportEfficiency
                              ? countryData.additionalInfo
                                  .publicTransportEfficiency
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
                          src={`https://maps.google.com/maps?q=${countryData.name}&hl=en&z=6&maptype=satellite&output=embed`}
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
                          {countryData.additionalInfo.qualityOfLife ??
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
                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.averageCost")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.avgCosts ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.mostExpensiveCity")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.mostExpensiveCity ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.cheapestCity")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.cheapestCity ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.mostExpensiveStates")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.mostExpensiveStates
                            ? countryData.costOfLiving.mostExpensiveStates.map(
                                (state, index) => (
                                  <div key={state} className="my-2">
                                    <h3 className="font-semibold">
                                      {index + 1}.{" "}
                                      <span className="ml-1">{state.name}</span>
                                    </h3>
                                    <p className="ml-[22px]">
                                      - {state.details}
                                    </p>
                                  </div>
                                )
                              )
                            : t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.rentPerMonth")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.rentPerMonth ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.howToFindApartment")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.howToFindApartment ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.food")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.food ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.mobilePhonePlan")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.mobilePhonePlan ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.childCare")}
                        </h3>
                        <p>
                          {countryData.costOfLiving.childCare ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>
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
                          {countryData.additionalInfo.workLifeBalance ??
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
                          {countryData.additionalInfo.worldHappinessIndex ??
                            t("userDashboard.country.noDataAvailable")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          {t("userDashboard.country.whiScore")}
                        </h3>
                        <p>
                          {countryData.additionalInfo.worldHappinessIndexScore
                            ? `${countryData.additionalInfo.worldHappinessIndexScore}/10`
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
                        </div>
                      )}

                      {countryData.visaAndImmigration?.visaTypes && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-passport"></i>{" "}
                            {t("userDashboard.country.visaTypes")}
                          </h3>
                          <p>
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
                              )
                            )}
                          </p>
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
                              ? countryData.visaAndImmigration.visaRequirements.map(
                                  (item, index) => (
                                    <div key={item} className="my-2">
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
                                  )
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>
                      )}

                      {countryData.visaAndImmigration?.applicationProcess && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-passport"></i>{" "}
                            {t("userDashboard.country.visaApplication")}
                          </h3>
                          <p>
                            {countryData.visaAndImmigration.applicationProcess
                              ? countryData.visaAndImmigration.applicationProcess.map(
                                  (item, index) => (
                                    <div key={item} className="my-2">
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
                                  )
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
                              ? countryData.visaAndImmigration.obtainCitizenship.map(
                                  (item, index) => (
                                    <div key={item} className="my-2">
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
                                  )
                                )
                              : t("userDashboard.country.noDataAvailable")}
                          </p>
                        </div>
                      )}
                      {countryData.visaAndImmigration?.embassies && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-plane-departure"></i>{" "}
                            {t("userDashboard.country.embassies")}
                          </h3>
                          <ul className="list-disc [&>li]:mt-2 pl-5">
                            {countryData.visaAndImmigration.embassies.map(
                              (embassy, index) => (
                                <li key={index}>
                                  <span>{embassy.description}</span>
                                  <div>
                                    <span className="font-semibold">
                                      {t("userDashboard.country.link")}:
                                    </span>{" "}
                                    <a
                                      href={embassy.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline underline-offset-4"
                                    >
                                      {embassy.link}
                                    </a>
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
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
                            {countryData.taxAndFinance?.personalIncomeTax
                              ?.federalRate ||
                              t("userDashboard.country.notApplicable")}
                          </p>
                        </p>
                        <p className="mt-3">
                          <span className="underline underline-offset-4 font-semibold">
                            {t("userDashboard.country.communalRate")}
                          </span>
                          <p className="mt-3">
                            {countryData.taxAndFinance?.personalIncomeTax
                              ?.communalRate ||
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
              </Tabs>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CountryDetails;
