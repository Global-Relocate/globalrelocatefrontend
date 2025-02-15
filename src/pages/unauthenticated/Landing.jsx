import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import FeaturesCard from "../../components/cards/FeaturesCard";
import CountriesCard from "../../components/cards/CountriesCard";

// countries imports
import nigeria from "../../assets/images/nigeria.png";
import swizerland from "../../assets/images/swizerland.png";
import london from "../../assets/images/london.png";
import italy from "../../assets/images/italy.png";
import china from "../../assets/images/china.png";
import uae from "../../assets/images/uae.png";

// features
import people from "../../assets/images/people_image.png";
import cardimg1 from "../../assets/images/cardimg_1.png";
import cardimg2 from "../../assets/images/cardimg_2.png";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartNow = () => {
    navigate("/login");
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center bg-[#F5F5F7]">
        <div className="hero-bg min-h-[85vh] md:min-h-[100vh] w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center max-w-[600px] md:min-w-[900px] text-black relative">
            <h1 className="text-4xl text-center md:text-5xl max-w-[90%] md:max-w-[600px] lg:text-7xl font-semibold">
              {t("landingPage.showcase.title")}
            </h1>
            <p className="text-center my-8 text-md md:text-md max-w-[600px] px-10 line-clamp-2">
              {t("landingPage.showcase.para")}
            </p>
            <button
              className="bg-[#fca311] text-black py-2 px-8 rounded-xl text-lg font-medium"
              onClick={handleStartNow}
            >
              {t("landingPage.showcase.buttonText")}
            </button>
            <div className="absolute bg-white rounded-3xl hidden md:flex items-center justify-start p-2 pr-3 shadow-md  space-x-2 top-10 left-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/800px-Flag_of_Canada_%28Pantone%29.svg.png"
                className="w-7 h-7 rounded-full"
                alt="logo"
              />
              <span>Canada</span>
            </div>
            <div className="absolute bg-white rounded-3xl hidden md:flex items-center justify-start p-2 pr-3 shadow-md  space-x-2 top-[-15px] right-0">
              <img
                src="https://cdn.britannica.com/97/897-050-0BFECDA5/Flag-Germany.jpg"
                className="w-7 h-7 rounded-full"
                alt="logo"
              />
              <span>Germany</span>
            </div>
            <div className="absolute bg-white rounded-3xl hidden md:flex items-center justify-start p-2 pr-3 shadow-md  space-x-2 bottom-0 left-14">
              <img
                src="https://cdn.britannica.com/82/682-004-F0B47FCB/Flag-France.jpg"
                className="w-7 h-7 rounded-full"
                alt="logo"
              />
              <span>France</span>
            </div>
            <div className="absolute bg-white rounded-3xl hidden md:flex items-center justify-start p-2 pr-3 shadow-md  space-x-2 bottom-0 right-14">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg"
                className="w-7 h-7 rounded-full"
                alt="logo"
              />
              <span>Australia</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl md:text-4xl my-3 font-medium">
          {" "}
          {t("landingPage.features.title")}
        </h2>
        <div className="flex items-center gap-14 justify-evenly flex-wrap  py-20 w-[90%]">
          <FeaturesCard
            title={t("landingPage.features.cards.card1.title")}
            para={t("landingPage.features.cards.card1.para")}
            image={people}
          />
          <FeaturesCard
            title={t("landingPage.features.cards.card2.title")}
            para={t("landingPage.features.cards.card2.para")}
            image={cardimg1}
          />
          <FeaturesCard
            title={t("landingPage.features.cards.card3.title")}
            para={t("landingPage.features.cards.card3.para")}
            image={cardimg2}
          />
        </div>
        <h2 className="text-4xl font-medium mt-20">
          {t("landingPage.countries.title")}
        </h2>
        <p className="mt-4 text-center px-5">
          {t("landingPage.countries.para")}
        </p>
        <div className="flex items-center justify-evenly flex-wrap gap-y-10  py-20 w-[90%]">
          <CountriesCard
            image={swizerland}
            location="Zürich, Switzerland"
            countryFlag="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png"
          />
          <CountriesCard
            image={london}
            location="London, UK"
            countryFlag="https://t4.ftcdn.net/jpg/08/32/02/87/360_F_832028757_4YU1BrvVBRUNJX7WvLf5g4Qm5xrjOBo6.jpg"
          />
          <CountriesCard
            image={china}
            location="Beijing, China"
            countryFlag="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx-FLVbYtX7A6P_Zjkt5pp0DafB3gXraLsNQ&s"
          />
          <CountriesCard
            image={italy}
            location="Milan, Italy"
            countryFlag="https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/220px-Flag_of_Italy.svg.png"
          />
          <CountriesCard
            image={uae}
            location="UAE"
            countryFlag="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png"
          />
          <CountriesCard
            image={nigeria}
            location="Lagos, Nigeria"
            countryFlag="https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg"
          />
        </div>
        <h2 className="text-4xl my-4 font-medium">
          {t("landingPage.whyChooseUs.title")}
        </h2>
        <div className="flex items-start justify-evenly flex-wrap gap-y-10  py-20 w-[90%]">
          <div className="flex flex-col items-start w-[90%] md:w-[285px] border-t-2 py-5 border-black">
            <h2 className="text-lg font-semibold mb-2">
              {t("landingPage.whyChooseUs.card1.title")}
            </h2>
            <p> {t("landingPage.whyChooseUs.card1.para")}</p>
          </div>
          <div className="flex flex-col items-start w-[90%] md:w-[285px] border-t-2 py-5 border-black">
            <h2 className="text-lg font-semibold mb-2">
              {t("landingPage.whyChooseUs.card2.title")}
            </h2>
            <p> {t("landingPage.whyChooseUs.card2.para")}</p>
          </div>
          <div className="flex flex-col items-start w-[90%] md:w-[285px] border-t-2 py-5 border-black">
            <h2 className="text-lg font-semibold mb-2">
              {t("landingPage.whyChooseUs.card3.title")}
            </h2>
            <p>{t("landingPage.whyChooseUs.card3.para")}</p>
          </div>
          <div className="flex flex-col items-start w-[90%] md:w-[285px] border-t-2 py-5 border-black">
            <h2 className="text-lg font-semibold mb-2">
              {t("landingPage.whyChooseUs.card4.title")}
            </h2>
            <p>{t("landingPage.whyChooseUs.card4.para")}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
