import DashboardLayout from "@/components/layouts/DashboardLayout";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import TaxSummary from "@/components/ui/tax-summary";

// Icons
import { PiGlobeHemisphereWestLight } from "react-icons/pi";
import { PiMoneyLight } from "react-icons/pi";
import { PiUsers } from "react-icons/pi";
import { useTranslation } from "react-i18next";

function TaxCalculator() {
  const [formData, setFormData] = useState({
    country: "",
    annualIncome: "",
    taxDuration: "year",
  });

  const [countryCode, setCountryCode] = useState("");
  const [countryFlag, setCountryFlag] = useState("");

  const [taxSummary, setTaxSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const taxSummaryRef = useRef(null);
  const { t } = useTranslation();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Reset tax summary when inputs change
    setTaxSummary(null);
  };

  const isFormValid = () => {
    return formData.country && formData.annualIncome && formData.taxDuration;
  };

  useEffect(() => {
    setTaxSummary(null); // Reset calculation on country change
  }, [formData.country, formData.annualIncome]);

  const calculateTax = async () => {
    setLoading(true);

    setTaxSummary({
      countryCode,
      countryFlag,
      income: formData.annualIncome,
      timePeriod: formData.taxDuration,
    });

    setLoading(false);

    taxSummaryRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-y-6 gap-x-8 px-4">
        <div className="overflow-hidden rounded-2xl w-full">
          {/* Header Section - Purple background */}
          <div className="bg-[#5762D5] text-white px-6 py-8">
            <h2 className="text-3xl font-medium">
              {t(`userDashboard.tax.taxCalculator`)}
            </h2>
            <p className="text-base mt-1 opacity-90">
              {t(`userDashboard.tax.taxCacluatorDesc`)}
            </p>
          </div>

          {/* Form Section - Grey background */}
          <div className="bg-[#F8F8F8] px-6 py-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <PiGlobeHemisphereWestLight className="text-lg" />
                  {t(`userDashboard.tax.country`)}
                </label>
                <CountryDropdown
                  value={formData.country}
                  onChange={(country) => {
                    handleInputChange("country", country.alpha2);
                    setCountryCode(country.alpha2);
                    setCountryFlag(country.emoji);
                  }}
                  placeholder={t(`userDashboard.tax.selectCountry`)}
                  textSize="sm"
                />
              </div>

              {/* Annual Income */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <PiMoneyLight className="text-lg" />
                  {t(`userDashboard.tax.annualIncome`)}
                </label>
                <Input
                  type="number"
                  min="15000"
                  placeholder={t(`userDashboard.tax.enterIncome`)}
                  value={formData.annualIncome}
                  onChange={(e) =>
                    handleInputChange("annualIncome", e.target.value)
                  }
                  className="h-12 bg-white text-sm placeholder:text-gray-400"
                  borderColor="gray-300"
                />
              </div>

              <div className="space-y-2 col-span-full">
                <label className="text-sm font-medium flex items-center gap-2">
                  <PiUsers className="text-lg" />
                  {t(`userDashboard.tax.taxPeriod`)}
                </label>
                <Select
                  defaultValue="year"
                  onValueChange={(value) =>
                    handleInputChange("taxDuration", value)
                  }
                >
                  <SelectTrigger className="h-12 bg-white text-sm border-gray-300 focus:ring-gray-300">
                    <SelectValue
                      placeholder={t(`userDashboard.tax.selectAccount`)}
                    />
                  </SelectTrigger>
                  <SelectContent onValueChange={calculateTax}>
                    <SelectItem value="year">
                      {t(`userDashboard.tax.year`)}
                    </SelectItem>
                    <SelectItem value="month">
                      {t(`userDashboard.tax.month`)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex w-full">
              <Button
                disabled={!isFormValid()}
                onClick={calculateTax}
                className="w-full flex-1 sm:w-auto px-8 bg-black hover:bg-black/90 text-white rounded-lg"
                size="lg"
              >
                {loading ? (
                  <i className="fas fa-spinner-third fa-spin text-lg" />
                ) : (
                  t(`userDashboard.tax.calculateTax`)
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full order-first lg:w-5/12 lg:order-last">
          <h3 className="text-xl">
            <i className="far fa-info-circle mr-1" />{" "}
            {t(`userDashboard.tax.usageGuide`)}
          </h3>
          <div className="text-sm text-gray-600 mt-4">
            <ul className="list-disc [&>li]:mt-2">
              <li>{t("userDashboard.tax.usageGuide1")}</li>
              <li>{t("userDashboard.tax.usageGuide2")}</li>
              <li>{t("userDashboard.tax.usageGuide3")}</li>
              <li>{t("userDashboard.tax.usageGuide4")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      {taxSummary && (
        <div ref={taxSummaryRef}>
          <TaxSummary {...taxSummary} />
        </div>
      )}
    </DashboardLayout>
  );
}

export default TaxCalculator;
