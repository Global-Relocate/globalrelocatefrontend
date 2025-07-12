import { useState } from "react";
import logo from "../../assets/images/footer_logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { showToast } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="text-[#7E7E7E] w-full bg-black pt-[64px] pb-[8px] max-900:pt-[48px] max-900:pb-[8px] max-900:px-0 mt-8">
      <div className="max-w-[1440px] mx-auto px-[25px]">
        <div className="flex flex-col">
          <div className="footerMain flex-wrap">
            <div className="footerCol">
              <img src={logo} alt="logo" width={185} className="h-14" />
              <div className="mt-6 flex flex-col space-y-3">
                <div className="flex justify-between">
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
                <a
                  href="mailto:support@globalrelocate.com"
                  className="flex items-center hover:text-white gap-4"
                >
                  <i className="fas fa-envelope text-2xl"></i>
                  support@globalrelocate.com
                </a>
              </div>
            </div>

            {/* Links Section */}
            <div className="footerCol">
              <h4 className="font-semibold text-white mb-3">
                {t("footer.topCountries")}
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { to: "", label: "Nigeria" },
                  {
                    to: "",
                    label: "United States",
                  },
                  {
                    to: "",
                    label: "United Kingdom",
                  },
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

            <div className="footerCol">
              <h4 className="font-semibold text-white mb-3">
                {t("footer.trends")}
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { to: "", label: t("footer.foreignCitizenship") },
                  {
                    to: "",
                    label: t("footer.digitalNomadVisas"),
                  },
                  {
                    to: "",
                    label: t("footer.taxesRankings"),
                  },
                  { to: "", label: t("footer.residencyPermit") },
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

            {/* Rankings Section */}
            <div className="footerCol">
              <h4 className="font-semibold text-white mb-3">
                {t("footer.rankings")}
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { to: "", label: t("footer.safestCountries") },
                  {
                    to: "",
                    label: t("footer.humanFreedomLevel"),
                  },
                  {
                    to: "",
                    label: t("footer.lifeExpectancy"),
                  },
                  { to: "", label: t("footer.happinessIndex") },
                  { to: "", label: t("footer.citizenshipQualityRankings") },
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

            {/* Company Section */}
            <div className="footerCol">
              <h4 className="font-semibold text-white mb-3">
                {t("footer.company")}
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { to: "/terms", label: t("loginPage.tos") },
                  { to: "/privacy", label: t("loginPage.privacyPolicy") },
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
          </div>

          {/* Newsletter Section */}
          <div className="mt-8 w-full flex items-center justify-between flex-col gap-y-6 lg:flex-row lg:gap-y-0">
            {/* Payment Methods Section */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-8 w-full flex justify-evenly space-x-4 mb-8 md:mb-0 md:mt-0 md:w-fit md:justify-between md:items-center cursor-pointer">
                  <i className="fab fa-cc-visa text-2xl"></i>
                  <i className="fab fa-cc-discover text-2xl"></i>
                  <i className="fab fa-cc-mastercard text-2xl"></i>
                  <i className="fab fa-cc-amex text-2xl"></i>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>We only support payment by credit card for now.</p>
              </TooltipContent>
            </Tooltip>

            <div className="w-fit">
              <h3 className="text-white text-lg font-medium mb-3">
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

          <div className="text-left md:text-center mt-8 pb-4 text-[0.875rem]">
            {t("footer.copyright")} <br /> &copy; 2025 Global Relocate
          </div>
        </div>
      </div>
    </div>
  );
}
