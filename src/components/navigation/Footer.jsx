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
      scale: 1.05,
      color: "#FCA311", // Highlight color
      transition: { 
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="text-[#7E7E7E] w-full flex items-center justify-center flex-col bg-black min-h-[500px]"
    >
      <div className="w-[90%] flex-wrap flex items-start justify-start gap-14 md:gap-36 p-4">
        <motion.img 
          variants={logoVariants}
          whileHover="hover"
          src={logo} 
          alt="logo" 
          className="cursor-pointer"
        />
        
        <motion.ul 
          variants={containerVariants}
          className="flex flex-col gap-5"
        >
          {[
            { to: "/", label: t("landingPage.navbar.home") },
            { to: "/user/countries", label: t("landingPage.navbar.countriesData") },
            { to: "#", label: t("landingPage.navbar.community") },
            { to: "#", label: t("landingPage.navbar.tools") },
            { to: "#", label: t("landingPage.navbar.contact") }
          ].map((item, index) => (
            <motion.li 
              key={index}
              variants={itemVariants}
            >
              <motion.div
                whileHover="hover"
                variants={linkVariants}
              >
                <Link to={item.to} className="block">
                  {item.label}
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>

        <motion.ul 
          variants={containerVariants}
          className="flex flex-col gap-5"
        >
          {[
            { to: "/term", label: "Terms" },
            { to: "/privacy", label: "Privacy" }
          ].map((item, index) => (
            <motion.li 
              key={index}
              variants={itemVariants}
            >
              <motion.div
                whileHover="hover"
                variants={linkVariants}
              >
                <Link to={item.to} className="block">
                  {item.label}
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}
