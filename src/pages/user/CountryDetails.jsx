import DashboardLayout from "@/components/layouts/DashboardLayout";
import swizerland from "../../assets/images/swizerland.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BiHeart, BiShare } from "react-icons/bi";
import { PiShare } from "react-icons/pi";
import { useCountryData } from "@/context/CountryDataContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

function CountryDetails() {
  const { id } = useParams();
  const { singleCountry, loading, getSingleCountry } = useCountryData();

  useEffect(() => {
    if (id) {
      getSingleCountry(id);
    }
  }, []);

  console.log(singleCountry);

  return (
    <DashboardLayout>
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
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png"
                className="w-9 h-9 rounded-full object-contain"
                alt=""
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
          <TabsList className="flex overflow-x-auto w-full justify-start gap-2 bg-white">
            <TabsTrigger
              value="overview"
              className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="visa"
              className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none"
            >
              Visa & Immigration
            </TabsTrigger>
            <TabsTrigger
              value="taxes"
              className="rounded-3xl data-[state=active]:bg-black data-[state=active]:text-white bg-white text-black border border-black shadow-none"
            >
              Taxes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <h2 className="font-medium text-2xl my-7">Background</h2>
            <p className=" text-[#222222]">
              The Swiss Confederation was founded in 1291 as a defensive
              alliance among three cantons. In succeeding years, other
              localities joined the original three. The Swiss Confederation
              secured its independence from the Holy Roman Empire in 1499. A
              constitution of 1848, which was modified in 1874 to allow voters
              to introduce referenda on proposed laws, replaced the
              confederation with a centralized federal government. The major
              European powers have long honored Switzerland's sovereignty and
              neutrality, and the country was not involved in either World War.
              The political and economic integration of Europe over the past
              half-century, as well as Switzerland's role in many UN and
              international organizations, has strengthened Switzerland's ties
              with its neighbors. However, the country did not officially become
              a UN member until 2002. Switzerland remains active in many UN and
              international organizations but retains a strong commitment to
              neutrality.
            </p>
          </TabsContent>
          <TabsContent value="visa"></TabsContent>
          <TabsContent value="taxes"></TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
}

export default CountryDetails;
