import DashboardLayout from "@/components/layouts/DashboardLayout";
import swizerland from "../../assets/images/swizerland.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BiHeart } from "react-icons/bi";
import { PiShare } from "react-icons/pi";
import { useCountryData } from "@/context/CountryDataContext";
import { useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import Autoplay from "embla-carousel-autoplay";
import { useTranslation } from "react-i18next";

function CountryDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { singleCountry, loading, getSingleCountry } = useCountryData();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getSingleCountry(id);
    }
  }, [id]);

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
      console.log("Your browser does not support the Share API");
    }
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
                  singleCountry?.name === "Afghanistan"
                    ? "https://flagcdn.com/w320/af.png"
                    : singleCountry?.keyFacts?.flag
                }
                className="w-10 h-10 rounded-full object-cover"
                alt="Country flag"
              />
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-medium">{singleCountry?.name}</h2>
                <span>
                  {t("userDashboard.country.countryIn")}{" "}
                  {singleCountry?.continent}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-3xl border">
                {" "}
                <BiHeart /> {t("userDashboard.country.addFavorite")}
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
            {singleCountry?.images.length > 0 ? (
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
              >
                <CarouselContent className="rounded-2xl">
                  {singleCountry.images.map((item, i) => {
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

            {singleCountry && (
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
                    {singleCountry.name} {t("userDashboard.country.overview")}
                  </h2>
                  <p className="text-[#222222]">
                    {singleCountry.overview === "No overview available"
                      ? t("userDashboard.country.noOverview")
                      : singleCountry.overview}
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
                                singleCountry?.name === "Afghanistan"
                                  ? "https://flagcdn.com/w320/af.png"
                                  : singleCountry?.keyFacts?.flag ||
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
                            {singleCountry.keyFacts?.capital || "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.languages")}
                          </h3>
                          <p className="text-md">
                            {singleCountry.keyFacts?.languages?.join(", ") ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.currency")}
                          </h3>
                          <p className="text-md">
                            {singleCountry.keyFacts?.currency?.full
                              ? `${singleCountry.keyFacts.currency.full} (${singleCountry.keyFacts.currency.abbreviation})`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.population")}
                          </h3>
                          <p className="text-md">
                            {singleCountry.keyFacts?.population?.inNumbers
                              ? parseInt(
                                  singleCountry.keyFacts.population.inNumbers
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-black mb-4">
                            {t("userDashboard.country.dialingCode")}
                          </h3>
                          <p className="text-md">
                            {singleCountry.keyFacts?.dialingCode || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>

                  <div className="mt-20 mb-6">
                    <div className="my-5">
                      <h2 className="text-2xl mt-2 mb-8">
                        {t("userDashboard.country.map")}
                      </h2>
                      <div className="rounded-2xl w-full">
                        <iframe
                          src={`https://maps.google.com/maps?q=${singleCountry.name}&hl=en&z=6&maptype=satellite&output=embed`}
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
                      <h2 className="text-2xl mt-2 mb-8">Cost Of Living</h2>
                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">
                          Average Cost
                        </h3>
                        <p>
                          {singleCountry.costOfLiving.avgCosts ??
                            "No data available."}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3">Summary</h3>
                        <p>
                          {singleCountry.costOfLiving.summary ??
                            "No data available."}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>
                </TabsContent>

                <TabsContent value="visa">
                  <h2 className="font-medium text-2xl my-7">
                    Visa & Immigration
                  </h2>
                  {singleCountry.visaAndImmigration?.summary !==
                    "No data available" && (
                    <div className="space-y-4">
                      {singleCountry.visaAndImmigration?.passportsAndVisas && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-passport"></i> Passports &
                            Visas
                          </h3>
                          <p>
                            {singleCountry.visaAndImmigration.passportsAndVisas}
                          </p>
                        </div>
                      )}
                      {singleCountry.visaAndImmigration?.shortStays && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-umbrella-beach"></i> Short
                            Stays
                          </h3>
                          <p>{singleCountry.visaAndImmigration.shortStays}</p>
                        </div>
                      )}
                      {singleCountry.visaAndImmigration?.longStays && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                            <i className="far fa-suitcase"></i> Long Stays
                          </h3>
                          <p>{singleCountry.visaAndImmigration.longStays}</p>
                        </div>
                      )}
                      {!singleCountry.visaAndImmigration?.passportsAndVisas &&
                        !singleCountry.visaAndImmigration?.shortStays &&
                        !singleCountry.visaAndImmigration?.longStays && (
                          <p>{t("userDashboard.country.noVisaInfo")}</p>
                        )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="taxes">
                  <h2 className="font-medium text-2xl my-7">Taxes & Finance</h2>
                  <div className="space-y-4 mb-4">
                    {singleCountry.taxAndFinance?.summary !==
                      "No data available" && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                          <i className="fal fa-info-circle"></i>
                          Summary
                        </h3>
                        <p>{singleCountry.taxAndFinance.summary}</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 space-y-3 md:space-y-0 md:space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                          <i className="fad fa-money-bill-transfer"></i>{" "}
                          Personal Income Tax
                        </h3>
                        <p>
                          <span className="underline underline-offset-4 font-semibold">
                            Federal Rate
                          </span>
                          <p className="mt-3">
                            {singleCountry.taxAndFinance?.personalIncomeTax
                              ?.federalRate ||
                              "Not applicable to this country."}
                          </p>
                        </p>
                        <p className="mt-3">
                          <span className="underline underline-offset-4 font-semibold">
                            Communal Rate
                          </span>
                          <p className="mt-3">
                            {singleCountry.taxAndFinance?.personalIncomeTax
                              ?.communalRate ||
                              "Not applicable to this country."}
                          </p>
                        </p>
                      </div>
                      <div className="md:border-l md:pl-4">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-x-3">
                          <i className="fad fa-money-check"></i> Corporate Tax
                        </h3>
                        <p>
                          {singleCountry.taxAndFinance?.corporateTax ||
                            "Not applicable to this country."}
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
