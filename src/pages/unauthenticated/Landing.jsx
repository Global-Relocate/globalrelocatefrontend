import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MainLayout from "../../components/layouts/MainLayout";
import AIAssistantCard from "@/components/cards/features/ai-assistant";
import VisaIndexCard from "@/components/cards/features/visa-index";
import CompareCountriesCard from "@/components/cards/features/compare-countries";
import CountriesCard from "@/components/cards/LandingCountriesCard";
import { Button } from "@/components/ui/button";

// countries imports
import nigeria from "../../assets/images/nigeria.png";
import swizerland from "../../assets/images/swizerland.png";
import london from "../../assets/images/london.png";
import italy from "../../assets/images/italy.png";
import china from "../../assets/images/china.png";
import uae from "../../assets/images/uae.png";
import chinaFlag from "../../assets/images/china-flag.png";
import nigeriaFlag from "../../assets/images/nigeria-flag.png";

import { useTranslation } from "react-i18next";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const api = import.meta.env.VITE_API_URL;

export default function Landing() {
  const { t } = useTranslation();
  const [randomCountries, setRandomCountries] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("basicPlan");
  const planOverview = useRef(null);
  const navigate = useNavigate();

  const cardVariants = {
    offscreen: {
      y: 100,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${api}/countries/list`);
        const countries = response.data.data || [];
        // Sort the countries randomly
        countries.sort(() => Math.random() - 0.5);
        setRandomCountries(countries.slice(0, 6));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const plans = [
    {
      slug: "freePlan",
      title: "Free",
      price: "0",
      features: [
        t("userDashboard.upgradePage.freePlan.item1"),
        t("userDashboard.upgradePage.freePlan.item2"),
        t("userDashboard.upgradePage.freePlan.item3"),
        t("userDashboard.upgradePage.freePlan.item4"),
      ],
    },
    {
      slug: "basicPlan",
      title: "Basic",
      price: "49.90",
      features: [
        t("userDashboard.upgradePage.basicPlan.item1"),
        t("userDashboard.upgradePage.basicPlan.item2"),
        t("userDashboard.upgradePage.basicPlan.item3"),
        t("userDashboard.upgradePage.basicPlan.item4"),
        t("userDashboard.upgradePage.basicPlan.item5"),
      ],
    },
    {
      slug: "premiumPlan",
      title: "Premium",
      price: "69.90",
      features: [
        t("userDashboard.upgradePage.premiumPlan.item1"),
        t("userDashboard.upgradePage.premiumPlan.item2"),
        t("userDashboard.upgradePage.premiumPlan.item3"),
        t("userDashboard.upgradePage.premiumPlan.item4"),
        t("userDashboard.upgradePage.premiumPlan.item5"),
        t("userDashboard.upgradePage.premiumPlan.item6"),
        t("userDashboard.upgradePage.premiumPlan.item7"),
        t("userDashboard.upgradePage.premiumPlan.item8"),
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center bg-[#F5F5F7] min-w-[320px]">
        <div className="hero-bg min-h-[40vh] md:min-h-[100vh] w-full flex items-center justify-center">
          <div className="md:w-[100%]">
            <DotLottieReact
              src="lottie.json"
              loop={false}
              autoplay
              quality="low"
            />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-4xl my-3 font-medium px-4 text-center"
        >
          {t("landingPage.features.title")}
        </motion.h2>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-center gap-6 sm:gap-10 md:gap-14 justify-evenly flex-wrap py-10 sm:py-20 w-[95%] sm:w-[90%] px-2 sm:px-0"
        >
          <motion.div variants={cardVariants}>
            <CompareCountriesCard />
            <AIAssistantCard />
            <VisaIndexCard />
          </motion.div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-medium mt-10 sm:mt-20 text-center px-4"
        >
          {t("landingPage.countries.title")}
        </motion.h2>
        <p className="mt-3 sm:mt-4 text-center px-5 text-sm sm:text-base">
          {t("landingPage.countries.para")}
        </p>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          className="flex items-center justify-evenly flex-wrap gap-y-8 sm:gap-y-10 py-10 sm:py-20 w-[95%] sm:w-[90%] px-2 sm:px-0"
        >
          {randomCountries && randomCountries.length > 0
            ? randomCountries.map((country, index) => (
                <motion.div key={index} variants={cardVariants} custom={index}>
                  <CountriesCard
                    slug={country.slug}
                    image={country.images[0] ?? "/images/images/swizerland.png"}
                    location={country.name}
                    countryFlag={country.flag}
                  />
                </motion.div>
              ))
            : [
                {
                  image: swizerland,
                  location: "Zürich, Switzerland",
                  flag:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png",
                },
                {
                  image: london,
                  location: "London, UK",
                  flag:
                    "https://t4.ftcdn.net/jpg/08/32/02/87/360_F_832028757_4YU1BrvVBRUNJX7WvLf5g4Qm5xrjOBo6.jpg",
                },
                {
                  image: china,
                  location: "Beijing, China",
                  flag: chinaFlag,
                  flagClassName: "w-7 h-7 object-cover",
                },
                {
                  image: italy,
                  location: "Milan, Italy",
                  flag:
                    "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/220px-Flag_of_Italy.svg.png",
                },
                {
                  image: uae,
                  location: "UAE",
                  flag:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png",
                },
                {
                  image: nigeria,
                  location: "Lagos, Nigeria",
                  flag: nigeriaFlag,
                  flagClassName: "w-7 h-7 object-cover",
                },
              ].map((country, index) => (
                <motion.div key={index} variants={cardVariants} custom={index}>
                  <CountriesCard
                    image={country.image}
                    slug={country.countrySlug}
                    location={country.location}
                    countryFlag={country.flag}
                  />
                </motion.div>
              ))}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl my-3 sm:my-4 font-medium text-center px-4"
        >
          {t("landingPage.whyChooseUs.title")}
        </motion.h2>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-start justify-evenly flex-wrap gap-y-8 sm:gap-y-10 py-10 sm:py-20 w-[95%] sm:w-[90%] px-2 sm:px-0"
        >
          {[
            {
              title: t("landingPage.whyChooseUs.card1.title"),
              para: t("landingPage.whyChooseUs.card1.para"),
            },
            {
              title: t("landingPage.whyChooseUs.card2.title"),
              para: t("landingPage.whyChooseUs.card2.para"),
            },
            {
              title: t("landingPage.whyChooseUs.card3.title"),
              para: t("landingPage.whyChooseUs.card3.para"),
            },
            {
              title: t("landingPage.whyChooseUs.card4.title"),
              para: t("landingPage.whyChooseUs.card4.para"),
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              custom={index}
              className="flex flex-col items-start w-full sm:w-[90%] md:w-[285px] border-t-2 py-5 border-black px-3 sm:px-0"
            >
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                {card.title}
              </h2>
              <p className="text-sm sm:text-base">{card.para}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl my-3 sm:my-4 font-medium text-center px-4"
        >
          {t("landingPage.pricing.title")}
        </motion.h2>
        <p className="mt-3 sm:mt-4 text-center px-5 text-sm sm:text-base">
          {t("landingPage.pricing.para")}
        </p>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-x-12 py-10 sm:py-20 w-[95%] sm:w-[90%] px-2 sm:px-0"
        >
          {[
            {
              title: t("landingPage.pricing.freePlan.title"),
              para: t("landingPage.pricing.freePlan.para"),
              slug: "freePlan",
            },
            {
              title: t("landingPage.pricing.basicPlan.title"),
              para: t("landingPage.pricing.basicPlan.para"),
              slug: "basicPlan",
            },
            {
              title: t("landingPage.pricing.premiumPlan.title"),
              para: t("landingPage.pricing.premiumPlan.para"),
              slug: "premiumPlan",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              custom={index}
              className={`flex flex-col justify-between w-full p-10 text-center rounded-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer ${selectedPlan ===
                card.slug && "border-2 border-black"}`}
              onClick={() => {
                setSelectedPlan(card.slug);
                planOverview.current.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <h2 className="text-xl font-semibold mb-2 text-center w-full">
                {card.title}
              </h2>
              <p className="text-lg">{card.para}</p>

              <div className="w-full mt-8">
                <Button
                  className="bg-black text-white px-5 py-2 rounded-md w-full h-12"
                  onClick={() => {
                    setSelectedPlan(card.slug);
                    planOverview.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  {t("landingPage.pricing.getStarted")}
                </Button>

                <Button
                  className="bg-transparent text-primary rounded-md mt-5 w-full shadow-none hover:bg-transparent hover:shadow-none cursor-pointer"
                  onClick={() => {
                    setSelectedPlan(card.slug);
                    planOverview.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  <i className="fas fa-chevron-down text-2xl"></i>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          className="py-10 sm:py-20 mx-10 md:w-[85%] px-2 sm:px-0 border-2 border-black rounded-md mb-10"
          ref={planOverview}
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-8 px-10">
            <div className="flex flex-col gap-2">
              <div className="font-medium">{t("landingPage.pricing.plan")}</div>
              <div className="text-2xl font-semibold">
                {t(`landingPage.pricing.${selectedPlan}.title`)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {plans
                  .find((plan) => plan.slug === selectedPlan)
                  ?.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-x-4">
                      <FaCheckCircle className="text-[#7981DD] flex-shrink-0 text-xl" />
                      <span className="text-gray-600 text-xl">{feature}</span>
                    </div>
                  ))}
              </div>

              <Button
                className="bg-black text-white px-5 py-2 rounded-md w-full h-12 mt-8"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-7xl font-bold">
                €{plans.find((plan) => plan.slug === selectedPlan)?.price}
              </h3>{" "}
              / {t("userDashboard.upgradePage.perMonth")}
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
