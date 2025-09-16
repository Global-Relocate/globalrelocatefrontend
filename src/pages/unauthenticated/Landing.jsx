import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MainLayout from "../../components/layouts/MainLayout";
import FeaturesCard from "../../components/cards/FeaturesCard";
import CountriesCard from "../../components/cards/LandingCountriesCard";

// countries imports
import nigeria from "../../assets/images/nigeria.png";
import swizerland from "../../assets/images/swizerland.png";
import london from "../../assets/images/london.png";
import italy from "../../assets/images/italy.png";
import china from "../../assets/images/china.png";
import uae from "../../assets/images/uae.png";
import chinaFlag from "../../assets/images/china-flag.png";
import nigeriaFlag from "../../assets/images/nigeria-flag.png";

// features
import people from "../../assets/images/people_image.png";
import cardimg1 from "../../assets/images/cardimg_1.png";
import cardimg2 from "../../assets/images/cardimg_2.png";
import { useTranslation } from "react-i18next";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const api = import.meta.env.VITE_API_URL;

export default function Landing() {
  const { t } = useTranslation();
  const [randomCountries, setRandomCountries] = useState([]);

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
          {[
            {
              title: t("landingPage.features.cards.card1.title"),
              para: t("landingPage.features.cards.card1.para"),
              image: people,
            },
            {
              title: t("landingPage.features.cards.card2.title"),
              para: t("landingPage.features.cards.card2.para"),
              image: cardimg1,
            },
            {
              title: t("landingPage.features.cards.card3.title"),
              para: t("landingPage.features.cards.card3.para"),
              image: cardimg2,
            },
          ].map((card, index) => (
            <motion.div key={index} variants={cardVariants} custom={index}>
              <FeaturesCard
                title={card.title}
                para={card.para}
                image={card.image}
              />
            </motion.div>
          ))}
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
                  flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png",
                },
                {
                  image: london,
                  location: "London, UK",
                  flag: "https://t4.ftcdn.net/jpg/08/32/02/87/360_F_832028757_4YU1BrvVBRUNJX7WvLf5g4Qm5xrjOBo6.jpg",
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
                  flag: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/220px-Flag_of_Italy.svg.png",
                },
                {
                  image: uae,
                  location: "UAE",
                  flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png",
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
      </div>
    </MainLayout>
  );
}
