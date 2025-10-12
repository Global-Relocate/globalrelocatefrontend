import { useState } from "react";
import { Separator } from "./separator";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { getCountryName } from "@/data/country-translations";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import faqs from "@/data/calculators/faqs.json";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TaxSummary({
  taxData,
  countryCode = "DE",
  countryFlag,
  timePeriod = "month", // "year" | "month"
}) {
  const [viewMode, setViewMode] = useState(timePeriod);
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  const countryName = getCountryName(countryCode, selectedLanguage.code);
  const isYear = viewMode === t("userDashboard.tax.year").toLowerCase();
  const fmt = (n) =>
    Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

  if (!taxData) {
    return (
      <div className="text-center text-gray-500 p-8">
        {t("userDashboard.tax.noTaxData")}
      </div>
    );
  }

  // Extract data safely
  const {
    overview = {},
    benefits = {},
    taxDeductions = {},
    employeeSocialSecurityContributions = {},
    employerSocialSecurityContributions = {},
  } = taxData;

  // Core Values
  const gross = isYear
    ? overview.grossMonthlyIncomeEUR * 12
    : overview.grossMonthlyIncomeEUR;
  const totalTax = isYear
    ? overview.totalTaxToBePaidYearlyEUR
    : overview.totalTaxToBePaidMonthlyEUR;
  const netIncome = gross - totalTax;
  const averageTaxRate = gross > 0 ? (totalTax / gross) * 100 : 0;

  // FAQs localization
  const faqsData =
    faqs.find((f) => f.lang === selectedLanguage.code)?.items?.[countryCode] ||
    {};

  // Helpers for displaying key/value pairs
  const renderKeyValueList = (obj, title) => {
    const entries = Object.entries(obj).filter(
      ([key]) =>
        key !== "totalTaxesMonthlyEUR" && key !== "totalContributionsMonthlyEUR"
    );
    const totalKey =
      Object.keys(obj).find((k) => k.toLowerCase().includes("total")) || null;
    const totalValue = totalKey ? obj[totalKey] : null;

    return (
      <div className="mb-6 border-gray-200 border-b-2 py-3">
        <h4 className="font-semibold text-md mb-2 text-gray-700">{title}</h4>
        <ul className="space-y-2 text-sm">
          {entries.map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span>{t(`userDashboard.tax.${formatLabel(key)}`)}</span>
              <span className="font-semibold text-[#5762D5]">
                € {fmt(value)} / {viewMode}
              </span>
            </li>
          ))}
          {totalValue && (
            <li className="flex justify-between font-bold pt-2">
              <span>{t("userDashboard.tax.total")}</span>
              <span className="text-[#5762D5]">
                € {fmt(totalValue)} / {viewMode}
              </span>
            </li>
          )}
        </ul>
      </div>
    );
  };

  const formatLabel = (label) =>
    label
      .replace(/MonthlyEUR|YearlyEUR/g, "")
      .replace(/([A-Z])/g, "$1")
      .trim();

  return (
    <div className="w-full mt-10">
      <h3 className="text-xl font-semibold mb-8 text-center">
        {t(`userDashboard.tax.taxSummary`)}
      </h3>

      <div className="border border-[#5762D5] rounded-lg">
        <div className="grid lg:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow relative">
          {/* Left Column */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {countryFlag} {countryName}
              </h2>
              <div className="flex border rounded-3xl overflow-hidden">
                <button
                  className={`px-6 py-1 ${
                    isYear
                      ? "bg-[#5762D5] text-white"
                      : "bg-white text-gray-600"
                  }`}
                  onClick={() =>
                    setViewMode(t("userDashboard.tax.year").toLowerCase())
                  }
                >
                  {t(`userDashboard.tax.year`)}
                </button>
                <button
                  className={`px-4 py-1 ${
                    !isYear
                      ? "bg-[#5762D5] text-white"
                      : "bg-white text-gray-600"
                  }`}
                  onClick={() =>
                    setViewMode(t("userDashboard.tax.month").toLowerCase())
                  }
                >
                  {t(`userDashboard.tax.month`)}
                </button>
              </div>
            </div>

            {/* Gross Income */}
            <div className="text-sm font-medium mb-6">
              {t(`userDashboard.tax.grossIncome`)}:{" "}
              <p className="text-lg text-[#5762D5] mt-2 font-bold">
                € {fmt(gross)} / {viewMode}
              </p>
            </div>

            {/* Breakdown Sections */}
            {renderKeyValueList(
              taxDeductions,
              t(`userDashboard.tax.taxDeductions`)
            )}
            {renderKeyValueList(
              employeeSocialSecurityContributions,
              t(`userDashboard.tax.employeeContributions`)
            )}
            {renderKeyValueList(
              employerSocialSecurityContributions,
              t(`userDashboard.tax.employerContributions`)
            )}
            {renderKeyValueList(benefits, t(`userDashboard.tax.benefits`))}

            {/* Total Tax */}
            <div className="flex justify-between text-sm mb-4">
              <span>{t(`userDashboard.tax.totalTax`)}</span>
              <span className="text-[#5762D5] font-semibold">
                € {fmt(totalTax)} / {viewMode}
              </span>
            </div>

            {/* Net Income */}
            <div className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
              <div>
                <div className="font-bold text-sm text-[#5762D5]">
                  {t(`userDashboard.tax.netIncome`)}
                </div>
                <div className="text-lg font-bold text-[#5762D5]">
                  € {fmt(netIncome)} / {viewMode}
                </div>
              </div>
              <div>
                <i className="fas fa-wallet text-3xl text-[#5762D5]"></i>
              </div>
            </div>
          </div>

          {/* Separator */}
          <Separator
            className="hidden lg:block absolute inset-y-0 left-1/2 transform -translate-x-1/2 h-[80%] top-1/2 translate-y-[-50%]"
            orientation="vertical"
          />

          {/* Right Column */}
          <div>
            {/* Summary Text */}
            <p className="mb-6 text-[15px]">
              {t("userDashboard.tax.summaryText1")}{" "}
              <strong>€ {fmt(gross)}</strong>{" "}
              {t("userDashboard.tax.summaryText2")} {viewMode}.{" "}
              {t("userDashboard.tax.summaryText4")}{" "}
              <strong>€ {fmt(totalTax)}</strong>.{" "}
              {t("userDashboard.tax.summaryText5")}{" "}
              <strong>€ {fmt(netIncome)}</strong>.{" "}
              {t("userDashboard.tax.summaryText7")}{" "}
              <strong>{averageTaxRate.toFixed(1)}%</strong>.
            </p>

            {/* Percentage Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-sm font-semibold">
                  {t("userDashboard.tax.netIncome")}
                </div>
                <div className="text-2xl font-bold text-[#5762D5]">
                  {(100 - averageTaxRate).toFixed(1)}%
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center">
                <div className="text-sm font-semibold">
                  {t("userDashboard.tax.totalTax")}
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {averageTaxRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 mt-6">
              {t(`userDashboard.tax.disclaimer`)}
            </p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      {faqsData && Object.keys(faqsData).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center">
            {faqsData.tips?.title}
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(faqsData.tips || {}).map(([key, tip], index) =>
              tip.title && tip.content ? (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-md font-semibold">
                    {tip.title}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {tip.content}
                    </Markdown>
                  </AccordionContent>
                </AccordionItem>
              ) : null
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
}
