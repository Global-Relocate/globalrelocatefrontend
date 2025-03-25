import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/images/footer_logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotate: 3,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const linkVariants = {
    hover: {
      // scale: 1.05,
      color: "#FCA311", // Highlight color
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <div className="text-[#7E7E7E] w-full flex items-center justify-center flex-col bg-black min-h-[300px]">
      <div className="w-[90%] flex-wrap flex items-start justify-start gap-14 md:gap-36 p-4">
        <img
          src={logo}
          alt="logo"
          className="cursor-pointer"
        />

        <ul className="flex flex-col gap-5">
          {[
            { to: "/", label: t("landingPage.navbar.home") },
            { to: "/user/countries", label: t("landingPage.navbar.countriesData") },
            { to: "/user/tax-calculator", label: t("landingPage.navbar.tools") },
            { to: "/pricing", label: t("landingPage.navbar.pricing") }
          ].map((item, index) => (
            <li key={index}>
              <div>
                <Link to={item.to} className="block">
                  {item.label}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-5">
          {[
            { to: "/term", label: "Terms" },
            { to: "/privacy", label: "Privacy" }
          ].map((item, index) => (
            <li key={index}>
              <div>
                <Link to={item.to} className="block">
                  {item.label}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
