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
import { countryCurrencyCodes } from "@/seed/currency";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function TaxCalculator() {
  const [formData, setFormData] = useState({
    country: "",
    annualIncome: "",
    taxDuration: "year",
  });

  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [currency, setCurrency] = useState("");
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
    // Set default tax class when country changes
    // if (availableTaxClasses.length > 0) {
    //   setFormData((prev) => ({
    //     ...prev,
    //     taxClass: availableTaxClasses[0].name,
    //   }));
    // } else {
    //   setFormData((prev) => ({
    //     ...prev,
    //     taxClass: "",
    //   }));
    // }
    setTaxSummary(null); // Reset calculation on country change
  }, [formData.country, formData.annualIncome]);

  // const calculateTax = async () => {
  //   setLoading(true);

  //   const apiKey = import.meta.env.VITE_TAX_API_KEY;

  //   if (!apiKey) {
  //     return;
  //   }

  //   // Fetch VAT rate from the API
  //   try {
  //     const response = await axios.get(
  //       `https://api.apilayer.com/tax_data/price?amount=${formData.annualIncome}&country=${formData.country}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           apikey: apiKey,
  //         },
  //       }
  //     );

  //     const vatRate = response.data.vat_rate;

  //     const country = formData.country;
  //     const currency = countryCurrencyCodes[country];
  //     const income = parseFloat(formData.annualIncome);

  //     const totalTax = income * vatRate;
  //     const effectiveRate = vatRate;

  //     const takeHomeAmount = income - totalTax;
  //     const lowerCurrency = currency.toLowerCase();

  //     const exchangeResponse = await axios.get(
  //       `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${lowerCurrency}.json`
  //     );

  //     const exchangeRate = parseFloat(
  //       `${exchangeResponse.data[lowerCurrency].usd}`
  //     );

  //     if (!exchangeRate && vatRate > 0) {
  //       console.error("Exchange rate not found for currency:", lowerCurrency);
  //       setLoading(false);
  //       return;
  //     } else {
  //       // Set the tax summary state with the calculated values
  //       setTaxSummary({
  //         currency,
  //         taxAmount: totalTax,
  //         effectiveRate,
  //         exchangeRate,
  //         takeHomeAmount,
  //       });
  //     }

  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching tax data:", error);
  //   }

  //   // const country = formData.country;
  //   // const currency = countryCurrencyCodes[country];
  //   // const accountType = formData.taxClass;
  //   // const taxClass = availableTaxClasses.find((tc) => tc.name === accountType);
  //   // const income = parseFloat(formData.annualIncome);

  //   // let taxableIncome = income;
  //   // if (taxClass.deductions) {
  //   //   taxableIncome = Math.max(0, income - taxClass.deductions);
  //   // }

  //   // let totalTax = 0;
  //   // let effectiveRate = 0;
  //   // for (const bracket of taxClass.brackets) {
  //   //   if (taxableIncome > bracket.min) {
  //   //     const applicableAmountInBracket =
  //   //       bracket.max === null || taxableIncome < bracket.max
  //   //         ? taxableIncome - bracket.min
  //   //         : bracket.max - bracket.min;
  //   //     totalTax += applicableAmountInBracket * bracket.rate;
  //   //     effectiveRate += bracket.rate;
  //   //   } else {
  //   //     // If income is below the current bracket's min, no more tax applies from higher brackets
  //   //     break;
  //   //   }
  //   // }

  //   // const takeHomeAmount = income - totalTax;
  //   // const lowerCurrency = currency.toLowerCase();

  //   // const response = await axios.get(
  //   //   `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${lowerCurrency}.json`
  //   // );

  //   // const exchangeRate = parseFloat(`${response.data[lowerCurrency].usd}`);
  // };

  const calculateTax = async () => {
    setLoading(true);

    const newCurrency = countryCurrencyCodes[countryCode];
    setCurrency(newCurrency);

    setTaxSummary({
      countryName,
      currency: newCurrency,
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
                    setCountryName(country.name);
                    setCurrency(country.currencies[0].code);
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

              {/* Account Type */}
              {/* <div className="space-y-2 col-span-full">
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
                    {availableTaxClasses.length > 0 ? (
                      availableTaxClasses.map((tc) => (
                        <SelectItem key={tc.name} value={tc.name}>
                          {tc.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="null">
                        {t("userDashboard.tax.noTaxClasses")}
                      </SelectItem>
                    )}
                    <SelectItem value="federal">Federal Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

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
          <h3 className="text-xl font-semibold mb-8 text-center">
            {t(`userDashboard.tax.taxSummary`)}
          </h3>
          <div className="border border-[#5762D5] rounded-lg">
            <TaxSummary {...taxSummary} />
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
              {t(`userDashboard.tax.taxIncomeInCountry`, { countryName })}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md font-semibold">
                  {t(`userDashboard.tax.taxClassAndBrackets`)}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{t(`userDashboard.tax.taxClassBracketsDesc`)}</p>
                  <div>
                    <ul className="list-disc pl-6">
                      <li>{t(`userDashboard.tax.taxClassBrackets1`)}</li>
                      <li>{t(`userDashboard.tax.taxClassBrackets2`)}</li>
                      <li>{t(`userDashboard.tax.taxClassBrackets3`)}</li>
                      <li>{t(`userDashboard.tax.taxClassBrackets4`)}</li>
                    </ul>
                    <p className="mt-2">
                      {t(`userDashboard.tax.taxClassBrackets5`)}
                    </p>
                    <p className="mt-2">
                      {t(`userDashboard.tax.taxClassBrackets6`)}
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                      <li>{t(`userDashboard.tax.taxClassBrackets7`)}</li>
                      <li>{t(`userDashboard.tax.taxClassBrackets8`)}</li>
                      <li>{t(`userDashboard.tax.taxClassBrackets9`)}</li>
                      <li>{t(`userDashboard.tax.taxClassBrackets10`)}</li>
                      <li>{t(`userDashboard.tax.taxClassBrackets11`)}</li>
                      <li>{t(`userDashboard.tax.taxClassBrackets12`)}</li>
                    </ul>
                    <p className="mt-2">
                      {t(`userDashboard.tax.taxClassBrackets13`)}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-md font-semibold">
                  {t(`userDashboard.tax.calculatingIncomeTax`)}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{t(`userDashboard.tax.calculatingIncomeTaxDesc`)}</p>
                  <div>
                    <ul className="list-decimal pl-6">
                      <li>
                        {t(`userDashboard.tax.calculatingIncomeTaxSteps1`)}
                      </li>
                      <li>
                        {t(`userDashboard.tax.calculatingIncomeTaxSteps2`)}
                      </li>
                      <li>
                        {t(`userDashboard.tax.calculatingIncomeTaxSteps3`)}
                      </li>
                      <li>
                        {t(`userDashboard.tax.calculatingIncomeTaxSteps4`)}
                      </li>
                      <li>
                        {t(`userDashboard.tax.calculatingIncomeTaxSteps5`)}
                      </li>
                    </ul>
                  </div>

                  <p className="mt-2">
                    {t(`userDashboard.tax.calculatingIncomeTaxFinalNote`)}
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-md font-semibold">
                  {t("userDashboard.tax.tipsForExpats")}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{t("userDashboard.tax.tipsForExpatsDesc")}</p>
                  <div>
                    <ul className="list-decimal pl-6">
                      <li>{t("userDashboard.tax.tipsForExpats1")}</li>
                      <li>{t("userDashboard.tax.tipsForExpats2")}</li>
                      <li>{t("userDashboard.tax.tipsForExpats3")}</li>
                      <li>{t("userDashboard.tax.tipsForExpats4")}</li>
                      <li>{t("userDashboard.tax.tipsForExpats5")}</li>
                    </ul>
                  </div>
                  <p className="mt-2">
                    {t("userDashboard.tax.tipsForExpatsFinalNote")}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
              {t(`userDashboard.tax.faqs`)}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md font-semibold">
                  {t(`userDashboard.tax.faqTitle1`)}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{t(`userDashboard.tax.faqAnswer1`)}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-md font-semibold">
                  {t(`userDashboard.tax.faqTitle2`)}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{t(`userDashboard.tax.faqAnswer2`)}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-md font-semibold">
                  {t(`userDashboard.tax.faqTitle3`)}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{t(`userDashboard.tax.faqAnswer3`)}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-md font-semibold">
                  {t(`userDashboard.tax.faqTitle4`)}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{t(`userDashboard.tax.faqAnswer4`)}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
              {t(`userDashboard.tax.useFulLinks`)}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md font-semibold">
                  {t(`userDashboard.tax.useFulLinksDesc`)}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{t(`userDashboard.tax.useFulLinksIntro`)}</p>
                  <p>{t(`userDashboard.tax.useFulLinksIntro2`)}</p>
                  <ul className="list-disc pl-6">
                    <li>
                      <a
                        href="https://www.eu-gleichbehandlungsstelle.de/eugs-en/eu-citizens/information-center/taxes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {t(`userDashboard.tax.useFulLinks1`)}
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.iamexpat.de/expat-info/taxation-germany/german-tax-system"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {t(`userDashboard.tax.useFulLinks2`)}
                      </a>
                    </li>
                  </ul>

                  <p className="mt-2">
                    {t(`userDashboard.tax.useFulLinksFinalNote`)}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TaxCalculator;
