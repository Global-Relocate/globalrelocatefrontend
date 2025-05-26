import { useState } from "react";
import logo from "../../assets/images/footer_logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { showToast } from "@/components/ui/toast";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically make an API call to subscribe the email
      showToast({
        message: t("toast.thanksNewsletter"),
        type: "success",
      });
      setEmail("");
    }
  };

  return (
    <div className="text-[#7E7E7E] w-full bg-black">
      <div className="grid md:grid-cols-3 grid-cols-1 mt-10 py-10 md:mt-8 px-8 md:px-16">
        <div>
          <img
            src={logo}
            alt="logo"
            className="h-14 cursor-pointer mx-auto md:mx-0"
          />
          <div className="grid grid-cols-4 mt-8 text-center md:text-left">
            <a href="">
              <i className="fab fa-telegram text-2xl hover:text-white"></i>
            </a>
            <a href="">
              <i className="fab fa-facebook text-2xl hover:text-white"></i>
            </a>
            <a href="">
              <i className="fab fa-instagram text-2xl hover:text-white"></i>
            </a>
            <a href="">
              <i className="fab fa-whatsapp text-2xl hover:text-white"></i>
            </a>
          </div>
          <div className="mt-12">
            <a
              href="mailto:support@globalrelocate.com"
              className="flex items-center hover:text-white gap-4"
            >
              <i className="fas fa-envelope text-2xl"></i>
              support@globalrelocate.com
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-10 md:mt-0">
          <h4 className="font-semibold text-white">{t("footer.sitemap")}</h4>
          <ul className="flex flex-col gap-2">
            {[
              { to: "/", label: t("landingPage.navbar.home") },
              {
                to: "/user/countries",
                label: t("landingPage.navbar.countriesData"),
              },
              {
                to: "/user/tax-calculator",
                label: t("landingPage.navbar.tools"),
              },
              { to: "/pricing", label: t("landingPage.navbar.pricing") },
            ].map((item, index) => (
              <li key={index}>
                <div>
                  <Link
                    to={item.to}
                    className="block hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 mt-10 md:mt-0">
          <h4 className="font-semibold text-white">{t("footer.company")}</h4>
          <ul className="flex flex-col gap-2">
            {[
              { to: "/term", label: t("footer.terms") },
              { to: "/privacy", label: t("footer.privacy") },
              { to: "/contact-us", label: t("footer.contact") },
            ].map((item, index) => (
              <li key={index}>
                <div>
                  <Link
                    to={item.to}
                    className="block hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="mt-10">
          <h3 className="text-white text-lg font-medium mb-4">
            {t("footer.subscribeNewsletter")}
          </h3>
          <p className="text-sm mb-4">{t("footer.subscribeNewsDesc")}</p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.enterEmail")}
              className="flex-1 px-4 py-2 rounded-lg bg-[#1A1A1A] border border-[#333333] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#FCA311] hover:bg-[#e5940c] text-black rounded-lg text-sm transition-colors duration-200"
            >
              {t("footer.subscribe")}
            </button>
          </form>
        </div>
      </div>

      <div className="text-center mt-8 pb-4">
        {t("footer.copyright")} <br /> &copy; 2025 Global Relocate
      </div>
    </div>
  );
}
