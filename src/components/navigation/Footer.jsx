import React from "react";
import logo from "../../assets/images/footer_logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div className="text-[#7E7E7E] w-full flex items-center justify-center flex-col bg-black min-h-[500px]">
      <div className="w-[90%] flex-wrap flex items-start justify-start gap-14 md:gap-36 p-4">
        <img src={logo} alt="logo" />
        <ul className="flex flex-col gap-5">
          <li>
            <a href="#">{t("landingPage.navbar.home")}</a>
          </li>
          <li>
            <a href="#">{t("landingPage.navbar.countriesData")}</a>
          </li>
          <li>
            <a href="#">{t("landingPage.navbar.community")}</a>
          </li>
          <li>
            <a href="#">{t("landingPage.navbar.tools")}</a>
          </li>
          <li>
            <a href="#">{t("landingPage.navbar.contact")}</a>
          </li>
        </ul>

        <ul className="flex flex-col gap-5">
          <li>
            <Link to="/term">Terms</Link>
          </li>
          <li>
            <Link to="/privacy">Privacy</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
