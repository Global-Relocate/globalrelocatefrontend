import DashboardLayout from "@/components/layouts/DashboardLayout";
import swizerland from "../../assets/images/swizerland.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BiHeart, BiShare } from "react-icons/bi";
import { PiShare } from "react-icons/pi";
import { useCountryData } from "@/context/CountryDataContext";
import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

function CountryDetails() {
  const { id } = useParams();
  const countryFlag = useLocation()?.state;
  const { singleCountry, loading, getSingleCountry } = useCountryData();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getSingleCountry(id);
    }
  }, []);

  console.log(singleCountry);

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
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
                  singleCountry?.keyFacts?.flag ||
                  "https://flagcdn.com/w320/ci.png"
                }
                className="w-10 h-10 rounded-full object-cover"
                alt="Country flag"
              />
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-medium">{singleCountry?.name}</h2>
                <span>Country in {singleCountry?.continent}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-3xl border">
                {" "}
                <BiHeart /> Add to favorites
              </Button>
              <Button variant="outline" className="rounded-3xl border">
                {" "}
                <PiShare /> Share
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="w-full h-[500px] rounded-xl">
        {loading ? (
          <Skeleton className="w-full h-full mt-5 rounded-xl" />
        ) : (
          <img
            src={swizerland}
            className="w-full h-full object-cover object-center mt-5 rounded-xl"
            alt=""
          />
        )}
      </div>

      {singleCountry && (
        <Tabs defaultValue="overview" className="mt-5">
          <TabsList className="flex overflow-x-auto overflow-y-hidden w-full justify-start gap-2 bg-white whitespace-nowrap pb-1">
            <TabsTrigger
              value="overview"
              className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="visa"
              className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
            >
              Visa & Immigration
            </TabsTrigger>
            <TabsTrigger
              value="taxes"
              className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none flex-shrink-0"
            >
              Taxes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <h2 className="font-medium text-2xl my-7">Background</h2>
            <p className="text-[#222222]">
              {singleCountry.overview === "No overview available"
                ? "No overview information available for this country."
                : singleCountry.overview}
            </p>

            <h2 className="font-bold text-2xl my-7">Key Facts</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold">Capital</h3>
                <p>{singleCountry.keyFacts?.capital || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Languages</h3>
                <p>{singleCountry.keyFacts?.languages?.join(", ") || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Currency</h3>
                <p>
                  {singleCountry.keyFacts?.currency?.full
                    ? `${singleCountry.keyFacts.currency.full} (${singleCountry.keyFacts.currency.abbreviation})`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Population</h3>
                <p>
                  {singleCountry.keyFacts?.population?.inNumbers
                    ? parseInt(
                        singleCountry.keyFacts.population.inNumbers
                      ).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Dialing Code</h3>
                <p>{singleCountry.keyFacts?.dialingCode || "N/A"}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visa">
            <h2 className="font-medium text-2xl my-7">Visa & Immigration</h2>
            {singleCountry.visaImmigration?.summary !== "No data available" && (
              <div className="space-y-4">
                {singleCountry.visaImmigration?.passportsAndVisas && (
                  <div>
                    <h3 className="font-medium text-lg">Passports & Visas</h3>
                    <p>{singleCountry.visaImmigration.passportsAndVisas}</p>
                  </div>
                )}
                {singleCountry.visaImmigration?.shortStays && (
                  <div>
                    <h3 className="font-medium text-lg">Short Stays</h3>
                    <p>{singleCountry.visaImmigration.shortStays}</p>
                  </div>
                )}
                {singleCountry.visaImmigration?.longStays && (
                  <div>
                    <h3 className="font-medium text-lg">Long Stays</h3>
                    <p>{singleCountry.visaImmigration.longStays}</p>
                  </div>
                )}
                {!singleCountry.visaImmigration?.passportsAndVisas &&
                  !singleCountry.visaImmigration?.shortStays &&
                  !singleCountry.visaImmigration?.longStays && (
                    <p>No visa and immigration information available.</p>
                  )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="taxes">
            <h2 className="font-medium text-2xl my-7">Taxes & Finance</h2>
            <div className="space-y-4">
              {singleCountry.taxAndFinance?.summary !== "No data available" && (
                <div>
                  <h3 className="font-medium text-lg">Summary</h3>
                  <p>{singleCountry.taxAndFinance.summary}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Personal Income Tax</h3>
                  <p>
                    Federal Rate:{" "}
                    {singleCountry.taxAndFinance?.personalIncomeTax
                      ?.federalRate || "N/A"}
                  </p>
                  <p>
                    Communal Rate:{" "}
                    {singleCountry.taxAndFinance?.personalIncomeTax
                      ?.communalRate || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Corporate Tax</h3>
                  <p>{singleCountry.taxAndFinance?.corporateTax || "N/A"}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="visa"></TabsContent>
          <TabsContent value="taxes"></TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
}

export default CountryDetails;
