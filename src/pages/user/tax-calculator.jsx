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
                  {t(`userDashboard.tax.taxClass`)}
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
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
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
            Tax Summary
          </h3>
          <div className="border border-[#5762D5] rounded-lg">
            <TaxSummary {...taxSummary} />
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
              Income Tax in {countryName}: General Information & Tips
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md font-semibold">
                  German Tax Brackets and Classes
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    The German income tax system employs progressive tax rates,
                    meaning the rate increases as income rises. Starting at 14%
                    for the lower taxable income levels and reaching up to 45%
                    for the highest earners, this system aims to ensure fairness
                    in taxation.
                  </p>
                  <div>
                    <ul className="list-disc pl-6">
                      <li>
                        <strong>0% Tax Rate:</strong> Income up to €11,604
                      </li>
                      <li>
                        <strong>14% to 42% Tax Rate:</strong> Income above
                        €11,604 and up to €66,760
                      </li>
                      <li>
                        <strong>42% Tax Rate:</strong> Income from €66,761 and
                        up to €277,825
                      </li>
                      <li>
                        <strong>45% Tax Rate:</strong> Income exceeding €277,826
                      </li>
                    </ul>
                    <p className="mt-2">
                      Please consult a financial advisor for the most up to date
                      information.
                    </p>
                    <p className="mt-2">
                      Tax classes in Germany significantly affect how much tax
                      you pay. There are six classes, each designed to reflect
                      different family and employment situations. For instance,
                      tax class I is for single individuals, while tax class III
                      offers benefits for married couples. Choosing the correct
                      tax class can lead to substantial tax savings, especially
                      for families and married couples.
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                      <li>
                        <strong>Class I:</strong> Single or separated
                        individuals without children.
                      </li>
                      <li>
                        <strong>Class II:</strong> Single parents living alone
                        with their child or children, eligible for single-parent
                        benefits.
                      </li>
                      <li>
                        <strong>Class III:</strong> Married employees whose
                        spouse is not working or is in Class V; generally offers
                        the lowest tax rates.
                      </li>
                      <li>
                        <strong>Class IV:</strong> Married employees where both
                        partners earn an income; similar to single individuals
                        in Class I but with considerations for joint assessment.
                      </li>
                      <li>
                        <strong>Class V:</strong> One partner in a marriage opts
                        for Class III, and the other automatically falls into
                        Class V; typically results in higher tax withholding.
                      </li>
                      <li>
                        <strong>Class VI:</strong> For individuals with multiple
                        jobs, this class applies to the second and any
                        additional jobs, featuring the highest tax rate.
                      </li>
                    </ul>
                    <p className="mt-2">
                      Note: the calculator on this page is based on Class I.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-md font-semibold">
                  Calculating Your Income Tax
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    Calculating your net income in Germany involves
                    understanding not only the tax brackets and classes but also
                    accounting for social contributions and other deductions.
                    Here’s a simplified process to help you estimate your
                    take-home pay:
                  </p>
                  <div>
                    <ul className="list-decimal pl-6">
                      <li>
                        <strong>Determine Your Gross Salary:</strong> Start with
                        your annual gross salary.
                      </li>
                      <li>
                        <strong>Identify Your Tax Class:</strong> Your tax class
                        affects your tax rate. Use this to estimate your income
                        tax.
                      </li>
                      <li>
                        <strong>Calculate Social Contributions:</strong> Deduct
                        social security contributions, which typically include
                        health insurance, pension insurance, unemployment
                        insurance, and long-term care insurance.
                      </li>
                      <li>
                        <strong>Factor in Allowances and Deductions:</strong>{" "}
                        Include any applicable deductions such as childcare
                        allowances or education-related expenses.
                      </li>
                      <li>
                        <strong>Compute Net Salary:</strong> Subtract these
                        taxes and contributions from your gross salary to get
                        your net income.
                      </li>
                    </ul>
                  </div>

                  <p className="mt-2">
                    This method offers a framework for understanding how much of
                    your gross income will be available after taxes and social
                    contributions.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-md font-semibold">
                  Tips for Expats and New Employees in Germany
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    Expatriates and new employees in Germany face unique
                    challenges when navigating the tax system. Here are
                    practical tips to ensure a smooth transition and optimize
                    your tax situation:
                  </p>
                  <div>
                    <ul className="list-decimal pl-6">
                      <li>
                        <strong>Choose the Right Tax Class:</strong> Review and
                        select the most beneficial tax class for your situation.
                        Changes are possible under certain conditions, such as
                        marriage or the birth of a child.
                      </li>
                      <li>
                        <strong>Understand the Tax-Free Allowance:</strong>{" "}
                        Germany offers a tax-free allowance, ensuring that
                        income up to a certain threshold is not taxed.
                        Familiarize yourself with this to better plan your
                        finances.
                      </li>
                      <li>
                        <strong>Utilize Tax Deductions:</strong> Keep records of
                        potentially deductible expenses, including work-related
                        expenses, educational costs, and healthcare expenses.
                      </li>
                      <li>
                        <strong>Seek Professional Advice:</strong> Given the
                        complexity of the tax system, consulting with a tax
                        professional can provide personalized advice and ensure
                        compliance.
                      </li>
                      <li>
                        <strong>Stay Informed on Tax Filing Deadlines:</strong>{" "}
                        Be aware of the tax year and filing deadlines to avoid
                        penalties.
                      </li>
                    </ul>
                  </div>
                  <p className="mt-2">
                    These strategies can help manage your tax obligations
                    effectively and maximize your income in Germany.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md font-semibold">
                  What are the current income tax brackets in Germany?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    As of the latest update, tax brackets are: 0% for income up
                    to €11,604; 14%-42% for income between €11,604 and €66,760;
                    42% for income between €66,761 and €277,825; and 45% for
                    income above €277,826.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-md font-semibold">
                  How do I know which tax class I belong to in Germany?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    Your tax class depends on your marital status, employment
                    situation, and family conditions. Single individuals are
                    usually in class I, while married couples can benefit from
                    class III. Review your status and consult a tax advisor for
                    optimal classification.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-md font-semibold">
                  What special considerations should I be aware of when
                  calculating net salary in Germany?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    Remember to account for childcare allowances, potential
                    church tax, and the solidarity surcharge, as these can
                    impact your final net income.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-md font-semibold">
                  How can new employees optimize their tax situation in Germany?
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    Choosing the correct tax class, understanding the tax-free
                    allowance, utilizing applicable deductions, seeking
                    professional advice, and keeping informed about tax filing
                    deadlines are key steps to optimizing your tax situation.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
              Further Resources
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md font-semibold">
                  Useful Links and other resources
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    The German income tax system can be challenging. However, by
                    understanding the basics of tax brackets, classes, and
                    special considerations, and by applying practical tips, you
                    can make informed decisions that optimize your tax
                    situation. Whether you're calculating net income, choosing a
                    tax class, or exploring allowances and deductions, knowledge
                    is your most valuable tool.
                  </p>

                  <p>
                    For more detailed information, consider visiting the
                    following resources:
                  </p>

                  <ul className="list-disc pl-6">
                    <li>
                      <a
                        href="https://www.eu-gleichbehandlungsstelle.de/eugs-en/eu-citizens/information-center/taxes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Press and Information Office of the Federal Government
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.iamexpat.de/expat-info/taxation-germany/german-tax-system"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Expat Info: German Tax System
                      </a>
                    </li>
                  </ul>

                  <p className="mt-2">
                    Staying proactive and informed will empower you to navigate
                    the tax landscape in Germany with confidence.
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
