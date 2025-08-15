import { useMemo, useState } from "react";
import { calculateDynamicTax } from "@/data/calculators/calculateTaxData";
import { Separator } from "./separator";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { getCountryName } from "@/data/country-translations";
import faqs from "@/data/calculators/faqs.json";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TaxSummary({
  countryCode,
  countryFlag,
  income,
  timePeriod = "year", // "year" | "month"
}) {
  const [viewMode, setViewMode] = useState(timePeriod);
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  const countryName = getCountryName(countryCode);

  const annualizedIncome = useMemo(
    () =>
      timePeriod === "month" ? Number(income || 0) * 12 : Number(income || 0),
    [income, timePeriod]
  );

  const taxData = calculateDynamicTax(countryCode, annualizedIncome) || {};

  const currency = taxData.currency || "";
  const grossYear = Number(taxData.grossIncomeYear ?? annualizedIncome ?? 0);
  // const incomeTaxYear = Number(taxData.incomeTaxYear ?? taxData.incomeTax ?? 0);
  const totalTaxYear = Number(taxData.totalTax ?? 0);
  const netIncomeYear = Number(
    taxData.netIncomeYear ?? grossYear - totalTaxYear
  );

  // Derive monthly from annual baseline
  const grossMonth = grossYear / 12;
  // const incomeTaxMonth = incomeTaxYear / 12;
  const totalTaxMonth = totalTaxYear / 12;
  const netIncomeMonth = netIncomeYear / 12;

  const yearlyBreakdown = Array.isArray(taxData.taxes) ? taxData.taxes : [];

  const monthlyBreakdown =
    Array.isArray(taxData.monthlyTaxes) && taxData.monthlyTaxes.length
      ? taxData.monthlyTaxes
      : yearlyBreakdown.map((tax) => {
          const key = Object.keys(tax || {})[0];
          const node = key ? tax[key] : null;
          const yearlyAmount = Number(
            (node && (node.rate ?? node.value ?? 0)) || 0
          );
          return { [key]: { rate: yearlyAmount / 12 } };
        });

  const isYear = viewMode === "year";
  const grossValue = isYear ? grossYear : grossMonth;
  // const incomeTax = isYear ? incomeTaxYear : incomeTaxMonth;
  const totalTax = isYear ? totalTaxYear : totalTaxMonth;
  const netIncome = isYear ? netIncomeYear : netIncomeMonth;

  const averageTaxRatePct =
    typeof taxData.averageTaxRatePct === "number"
      ? taxData.averageTaxRatePct
      : grossYear > 0
      ? (totalTaxYear / grossYear) * 100
      : 0;

  // Helper for safe currency formatting
  const fmt = (n) =>
    Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const faqsData =
    faqs.find((f) => f.lang === selectedLanguage.code)?.items?.[countryCode] ||
    {};

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-8 text-center">
        {t(`userDashboard.tax.taxSummary`)}
      </h3>

      <div className="border border-[#5762D5] rounded-lg">
        <div className="grid lg:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow relative">
          {/* Left column */}
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
                  onClick={() => setViewMode("year")}
                >
                  {t(`userDashboard.tax.year`)}
                </button>
                <button
                  className={`px-4 py-1 ${
                    !isYear
                      ? "bg-[#5762D5] text-white"
                      : "bg-white text-gray-600"
                  }`}
                  onClick={() => setViewMode("month")}
                >
                  {t(`userDashboard.tax.month`)}
                </button>
              </div>
            </div>

            {/* Gross income */}
            <div className="text-sm font-medium mb-6">
              {t(`userDashboard.tax.grossIncome`)}:{" "}
              <p className="text-lg text-[#5762D5] mt-2">
                <span className="font-bold">
                  {currency} {fmt(grossValue)}
                </span>{" "}
                / {viewMode}
              </p>
            </div>

            <div className="mb-6 border-gray-200 border-y-2 py-4">
              {/* Tax breakdown */}
              <ul className="space-y-2 text-sm">
                {(isYear ? yearlyBreakdown : monthlyBreakdown).map(
                  (tax, idx) => {
                    const taxName = Object.keys(tax || {})[0] || `tax_${idx}`;
                    const node = taxName ? tax[taxName] : null;

                    // Accept either .rate or .value as the amount to show (in currency)
                    const amount = Number((node && (node.value ?? 0)) || 0);

                    return (
                      <li key={taxName} className="flex justify-between">
                        <span>{t(`userDashboard.tax.${taxName}`)}</span>
                        <span className="font-semibold">
                          {currency} {fmt(amount)} / {viewMode}
                        </span>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>

            {/* Total tax */}
            <div className="flex justify-between text-sm mb-4">
              <span>{t(`userDashboard.tax.totalTax`)}</span>
              <span className="text-[#5762D5] font-semibold">
                {currency} {fmt(totalTax)} / {viewMode}
              </span>
            </div>

            {/* Net income */}
            <div className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
              <div>
                <div className="font-bold text-sm text-[#5762D5]">
                  {t(`userDashboard.tax.netIncome`)}
                </div>
                <div className="text-lg font-bold text-[#5762D5]">
                  {currency} {fmt(netIncome)} / {viewMode}
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

          {/* Right column */}
          <div>
            {/* Summary text */}
            <p className="mb-6 text-[15px]">
              {t("userDashboard.tax.summaryText1")}{" "}
              <strong>
                {currency} {fmt(grossValue)}
              </strong>{" "}
              {t("userDashboard.tax.summaryText2")}{" "}
              {isYear
                ? t("userDashboard.tax.year")
                : t("userDashboard.tax.month")}{" "}
              {t("userDashboard.tax.summaryText3")} {countryName}{" "}
              {t("userDashboard.tax.summaryText4")}{" "}
              <strong>
                {currency} {fmt(totalTax)}
              </strong>
              . {t("userDashboard.tax.summaryText5")}{" "}
              <strong>
                {currency} {fmt(netIncomeYear)}
              </strong>{" "}
              {t("userDashboard.tax.summaryText6")}{" "}
              <strong>
                {currency} {fmt(netIncomeMonth)}
              </strong>{" "}
              {t("userDashboard.tax.summaryText7")}{" "}
              <strong>{averageTaxRatePct.toFixed(1)}%</strong>.
            </p>

            {/* Percentage cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-sm font-semibold">
                  {t("userDashboard.tax.netIncome")}
                </div>
                <div className="text-2xl font-bold text-[#5762D5]">
                  {(100 - averageTaxRatePct).toFixed(1)}%
                </div>
                <div className="mt-2 flex justify-center flex-wrap">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.round((20 * (100 - averageTaxRatePct)) / 100)
                          ? "text-[#5762D5]"
                          : "text-red-300"
                      }`}
                    >
                      $
                    </span>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center">
                <div className="text-sm font-semibold">
                  {t(`userDashboard.tax.totalTax`)}
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {averageTaxRatePct.toFixed(1)}%
                </div>
                <div className="mt-2 flex justify-center flex-wrap">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.round((20 * averageTaxRatePct) / 100)
                          ? "text-red-600"
                          : "text-[#5762D5]"
                      }`}
                    >
                      $
                    </span>
                  ))}
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

      {/* FAQS */}
      <div>
        {faqsData && Object.keys(faqsData).length > 0 && (
          <div className="w-full">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
                {faqsData.tips.title}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(faqsData.tips).map(([key, tip], index) => {
                  return (
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
                  );
                })}
              </Accordion>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
                {faqsData.faq.title}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(faqsData.faq).map(([key, faq], index) => {
                  return (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-md font-semibold">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        <Markdown remarkPlugins={[remarkGfm]}>{faq.a}</Markdown>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
                {faqsData.further.title}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${faqsData.further.links.title}`}>
                  <AccordionTrigger className="text-md font-semibold">
                    {faqsData.further.links.title}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {faqsData.further.links.content}
                    </Markdown>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
