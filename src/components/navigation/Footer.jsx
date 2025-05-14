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
        message: "Thank you for subscribing to our newsletter!",
        type: "success",
      });
      setEmail("");
    }
  };

  return (
    <div className="text-[#7E7E7E] w-full flex items-center justify-center flex-col bg-black min-h-[300px] min-w-[320px] mt-10">
      <div className="w-[90%] flex-wrap flex items-start justify-start gap-8 md:gap-36 p-4">
        <div>
          <img src={logo} alt="logo" className="h-8 cursor-pointer" />
        </div>

        <ul className="flex flex-col gap-5">
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

        <ul className="flex flex-col gap-5">
          {[
            { to: "/term", label: t("footer.terms") },
            { to: "/privacy", label: t("footer.privacy") },
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

        {/* Newsletter Section - Moved to the right */}
        <div className="ml-auto max-w-[400px]">
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
    </div>
  );
}
