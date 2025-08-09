import DashboardLayout from "@/components/layouts/DashboardLayout";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import TaxSummary from "@/components/ui/tax-summary";
import axios from "axios";

// Icons
import { PiGlobeHemisphereWestLight } from "react-icons/pi";
import { PiMoneyLight } from "react-icons/pi";
import { PiUsers } from "react-icons/pi";
import { countryCurrencyCodes } from "@/seed/currency";
import { taxData } from "@/data/tax-data";
import { useTranslation } from "react-i18next";

function TaxCalculator() {
  const [formData, setFormData] = useState({
    country: "",
    annualIncome: "",
    taxClass: "",
  });

  const [taxSummary, setTaxSummary] = useState(null);
  const [loading, setLoading] = useState(false);
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
    return formData.country && formData.annualIncome && formData.taxClass;
  };

  const currentCountryData = taxData.find(
    (data) => data.country === formData.country
  );
  const availableTaxClasses = currentCountryData
    ? currentCountryData.taxClasses
    : [];

  useEffect(() => {
    // Set default tax class when country changes
    if (availableTaxClasses.length > 0) {
      setFormData((prev) => ({
        ...prev,
        taxClass: availableTaxClasses[0].name,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        taxClass: "",
      }));
    }
    setTaxSummary(null); // Reset calculation on country change
  }, [formData.country, availableTaxClasses.length]);

  const calculateTax = async () => {
    setLoading(true);

    const apiKey = import.meta.env.VITE_TAX_API_KEY;

    if (!apiKey) {
      return;
    }

    // Fetch VAT rate from the API
    try {
      const response = await axios.get(
        `https://api.apilayer.com/tax_data/price?amount=${formData.annualIncome}&country=${formData.country}`,
        {
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
          },
        }
      );

      const vatRate = response.data.vat_rate;

      const country = formData.country;
      const currency = countryCurrencyCodes[country];
      const income = parseFloat(formData.annualIncome);

      const totalTax = income * vatRate;
      const effectiveRate = vatRate;

      const takeHomeAmount = income - totalTax;
      const lowerCurrency = currency.toLowerCase();

      const exchangeResponse = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${lowerCurrency}.json`
      );

      const exchangeRate = parseFloat(
        `${exchangeResponse.data[lowerCurrency].usd}`
      );

      if (!exchangeRate && vatRate > 0) {
        console.error("Exchange rate not found for currency:", lowerCurrency);
        setLoading(false);
        return;
      } else {
        // Set the tax summary state with the calculated values
        setTaxSummary({
          currency,
          taxAmount: totalTax,
          effectiveRate,
          exchangeRate,
          takeHomeAmount,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching tax data:", error);
    }

    // const country = formData.country;
    // const currency = countryCurrencyCodes[country];
    // const accountType = formData.taxClass;
    // const taxClass = availableTaxClasses.find((tc) => tc.name === accountType);
    // const income = parseFloat(formData.annualIncome);

    // let taxableIncome = income;
    // if (taxClass.deductions) {
    //   taxableIncome = Math.max(0, income - taxClass.deductions);
    // }

    // let totalTax = 0;
    // let effectiveRate = 0;
    // for (const bracket of taxClass.brackets) {
    //   if (taxableIncome > bracket.min) {
    //     const applicableAmountInBracket =
    //       bracket.max === null || taxableIncome < bracket.max
    //         ? taxableIncome - bracket.min
    //         : bracket.max - bracket.min;
    //     totalTax += applicableAmountInBracket * bracket.rate;
    //     effectiveRate += bracket.rate;
    //   } else {
    //     // If income is below the current bracket's min, no more tax applies from higher brackets
    //     break;
    //   }
    // }

    // const takeHomeAmount = income - totalTax;
    // const lowerCurrency = currency.toLowerCase();

    // const response = await axios.get(
    //   `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${lowerCurrency}.json`
    // );

    // const exchangeRate = parseFloat(`${response.data[lowerCurrency].usd}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-y-6 gap-x-8 px-4">
        <div className="overflow-hidden rounded-2xl mb-16 w-full">
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
                  onChange={(country) =>
                    handleInputChange("country", country.alpha2)
                  }
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

              {/* Account Type */}
              <div className="space-y-2 col-span-full">
                <label className="text-sm font-medium flex items-center gap-2">
                  <PiUsers className="text-lg" />
                  {t(`userDashboard.tax.taxClass`)}
                </label>
                <Select
                  defaultValue="federal"
                  onValueChange={(value) =>
                    handleInputChange("taxClass", value)
                  }
                >
                  <SelectTrigger className="h-12 bg-white text-sm border-gray-300 focus:ring-gray-300">
                    <SelectValue
                      placeholder={t(`userDashboard.tax.selectAccount`)}
                    />
                  </SelectTrigger>
                  <SelectContent onValueChange={calculateTax}>
                    {/*availableTaxClasses.length > 0 ? (
                      availableTaxClasses.map((tc) => (
                        <SelectItem key={tc.name} value={tc.name}>
                          {tc.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="null">
                        {t("userDashboard.tax.noTaxClasses")}
                      </SelectItem>
                    )*/}
                    <SelectItem value="federal">Federal Tax</SelectItem>
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

            {/* Tax Summary */}
            {taxSummary && (
              <div className="mt-8">
                <TaxSummary {...taxSummary} />
              </div>
            )}
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
    </DashboardLayout>
  );
}

export default TaxCalculator;
