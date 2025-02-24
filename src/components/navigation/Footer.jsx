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
            <Link to="/">{t("landingPage.navbar.home")}</Link>
          </li>
          <li>
            <Link to="/user/countries">
              {t("landingPage.navbar.countriesData")}
            </Link>
          </li>
          <li>
            <Link to="#">{t("landingPage.navbar.community")}</Link>
          </li>
          <li>
            <Link to="#">{t("landingPage.navbar.tools")}</Link>
          </li>
          <li>
            <Link to="#">{t("landingPage.navbar.contact")}</Link>
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
