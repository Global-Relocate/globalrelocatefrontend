import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CircleFlag } from "react-circle-flags";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageLoader from "@/components/loaders/PageLoader";

const baseURL = import.meta.env.VITE_API_URL;

export default function VisaRequirements() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [visaRequirements, setVisaRequirements] = useState(null);

  const fetchRequirements = async () => {
    setLoading(true);
    // Fetch visa requirements based on the country slug
    try {
      const response = await axios.get(
        `https://rough-sun-2523.fly.dev/country/${slug.toUpperCase()}`
      );
      setVisaRequirements(response.data);
    } catch (err) {
      setVisaRequirements(null);
      console.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  if (loading) {
    return <PageLoader />;
  }
  if (!visaRequirements)
    return (
      <DashboardLayout>
        <section className="min-h-screen">
          <p>No data found for the specified country.</p>
        </section>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          to="/visa-index"
          className="hover:underline flex items-center gap-x-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Visa Index
        </Link>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-y-6 gap-x-10 items-center">
        <div className="rounded-lg h-[341px] w-[230px] mx-auto">
          <img
            src={`${baseURL}/image/fetch/${slug?.toLowerCase() || "ng"}`}
            alt="passport"
            className="w-full h-full"
          />
        </div>
        <div className="w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {visaRequirements?.name} Passport Visa Free Countries (2025)
          </h1>
          <p>
            {visaRequirements?.name} passport holders can travel to various
            countries around the world, each with distinct visa requirements.
            There are a total of {visaRequirements?.VF?.length} visa-free travel
            destinations for {visaRequirements?.name} passport holders. This
            comprehensive guide offers detailed information on the destinations
            that citizens of {visaRequirements?.name} can visit without a prior
            visa, including lists of visa-free countries, visa-on-arrival
            countries, and Electronic Travel Authorization (eTA) countries.
            Additionally, this guide provides details on travel destinations
            that require a prior visa for {visaRequirements?.name} passport
            holders, including both electronic visas (eVisas) and regular visas.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          What are the visa-free countries for {visaRequirements?.name} passport
          holders?
        </h1>
        <p>
          {visaRequirements?.name} passport holders can travel without a visa to
          the following {visaRequirements?.VF?.length} countries:{" "}
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.VF?.map((country, index) => (
              <div key={index} className="flex items-center gap-x-4">
                {" "}
                <CircleFlag
                  countryCode={country.code.toLowerCase()}
                  height={20}
                  width={25}
                />
                {country.name}
              </div>
            ))}
          </div>

          <p className="my-6">
            {" "}
            The above list shows all the visa-exempt countries for{" "}
            {visaRequirements?.name}
            citizens. However, it is important to recognize that the duration of
            stay and permissible purposes for travel for{" "}
            {visaRequirements?.name} citizens in each country are subject to the
            respective nation&apos;s visa regulations. It is essential for{" "}
            {visaRequirements?.name} passport holders to verify if a visa is
            required for extended stays beyond the allowed duration of stay or
            for purposes not encompassed within the Visa Waiver Policy of the
            destination country.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          What countries provide visa on arrival and Electronic Travel
          Authorization eTA for {visaRequirements?.name} passport holders?
        </h1>
        <p>
          {visaRequirements?.name} nationals are eligible for a visa on arrival
          in the following {visaRequirements?.VOA?.length} countries. In most
          cases, a visa can be obtained at the airport or border crossing point
          upon arrival. Fees, validity, and allowed duration of stay may vary.
        </p>

        <p>
          An eTA is a digital travel document required for eligible travelers
          who are visa-exempt for a specific country, and it can be obtained
          online prior to travel. <br />
          <br /> Many countries with eTA systems have a streamlined and
          efficient application process, with approval often granted within
          hours or a few days. It is important to note that eligibility for an
          eTA varies depending on the traveler&apos;s nationality and the
          destination country. Travelers are advised to always check the
          specific entry requirements of the destination country before planning
          their trip.
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.VOA?.map((country, index) => (
              <div key={index} className="flex items-center gap-x-4">
                {" "}
                <CircleFlag
                  countryCode={country.code.toLowerCase()}
                  height={20}
                  width={25}
                />
                {country.name}
              </div>
            ))}
          </div>

          <p className="my-6">
            {" "}
            Upon arrival at the immigration checkpoint in the destination
            country, travelers may need to complete the requisite paperwork,
            provide any necessary documentation, and pay the relevant visa fee.
            The immigration officer will subsequently issue the visa, granting
            the visitor authorization to enter and remain in the country for the
            specified duration and purpose.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Which countries do {visaRequirements?.name} citizens need to apply for
          an e-visa?
        </h1>
        <p>
          The following {visaRequirements?.EV?.length} countries require{" "}
          {visaRequirements?.name} nationals to apply for an electronic visa
          (eVisa) before traveling. An eVisa is a digital visa that can be
          applied for online and, in most cases, sent to the applicant&apos;s
          email. Processing times, fees, and validity may vary among different
          countries.
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.EV?.map((country, index) => (
              <div key={index} className="flex items-center gap-x-4">
                {" "}
                <CircleFlag
                  countryCode={country.code.toLowerCase()}
                  height={20}
                  width={25}
                />
                {country.name}
              </div>
            ))}
          </div>

          <p className="my-6">
            {" "}
            The process of getting an eVisa typically involves filling out an
            online form, providing personal and passport information, uploading
            necessary documents (such as a passport-sized photo), and paying the
            visa fee. Once the application has been reviewed and approved, the
            e-Visa is sent to the applicant, usually via email, in a PDF or
            other electronic format. The traveler may need to print a copy to
            take with them when traveling. Requirements for e-Visas may vary
            depending on the traveler&apos;s nationality and the destination
            country. It is important to check the specific visa requirements for
            your destination country before planning your trip.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          List of Countries Requiring Visas for {visaRequirements?.name}{" "}
          Citizens
        </h1>
        <p>
          {visaRequirements?.name} passport holders need to apply for a regular
          visa before traveling to the following {visaRequirements?.VR?.length}{" "}
          countries:
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visaRequirements?.VR?.map((country, index) => (
              <div key={index} className="flex items-center gap-x-4">
                {" "}
                <CircleFlag
                  countryCode={country.code.toLowerCase()}
                  height={20}
                  width={25}
                />
                {country.name}
              </div>
            ))}
          </div>

          <p className="my-6">
            {" "}
            Visa processing times, fees, and required documents vary by the
            traveler&apos;s nationality and the destination country. To obtain a
            visa, travelers generally need to apply at the destination
            country&apos;s embassy or consulate in their country of origin or
            country of residence, providing required documents such as a
            passport, photographs, itinerary, proof of financial means, and
            other relevant information. It is important to check the specific
            visa requirements for your destination country before planning your
            trip to ensure that you have the appropriate documents and
            permissions for your visit.
          </p>

          <p className="my-6">
            {" "}
            The above lists of visa-free destinations for{" "}
            {visaRequirements?.name} passport holders are subject to change from
            time to time based on visa agreements between countries, temporary
            travel restrictions, and entry requirements imposed by countries. It
            is advised to check before traveling for any additional requirements
            or temporary restrictions that may be imposed by your travel
            destination country.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}
