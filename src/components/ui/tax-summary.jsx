import { useState } from "react";
import { calculateGermanyTax } from "@/data/calculators/germany"; // import the function from earlier
import { Separator } from "./separator";

export default function TaxSummary({
  countryName,
  currency,
  countryFlag,
  income,
  timePeriod = "year", // default to year
}) {
  const [gross, setGross] = useState(income);
  const [viewMode, setViewMode] = useState(timePeriod);

  const taxData = calculateGermanyTax(gross);

  let grossValue;
  let pension;
  let health;
  let care;
  let unemployment;
  let incomeTax;
  let totalTax;
  let netIncome;
  let netIncomeYear = taxData.netIncomeYear * 12;
  let netIncomeMonth = netIncomeYear / 12;

  if (viewMode === "month") {
    grossValue = taxData.grossIncomeYear;
    pension = taxData.social.pensionEmployee;
    health = taxData.social.healthEmployee;
    care = taxData.social.careEmployee;
    unemployment = taxData.social.unemploymentEmployee;
    incomeTax = taxData.incomeTax;
    totalTax = taxData.totalTax;
    netIncome = taxData.netIncomeYear;
  } else {
    grossValue = taxData.grossIncomeYear * 12;
    pension = taxData.social.pensionEmployee * 12;
    health = taxData.social.healthEmployee * 12;
    care = taxData.social.careEmployee * 12;
    unemployment = taxData.social.unemploymentEmployee * 12;
    incomeTax = taxData.incomeTax * 12;
    totalTax = taxData.totalTax * 12;
    netIncome = taxData.netIncomeYear * 12;
  }

  return (
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
                viewMode === "year"
                  ? "bg-[#5762D5] text-white"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setViewMode("year")}
            >
              Year
            </button>
            <button
              className={`px-4 py-1 ${
                viewMode === "month"
                  ? "bg-[#5762D5] text-white"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setViewMode("month")}
            >
              Month
            </button>
          </div>
        </div>

        {/* Gross income */}
        <div className="text-sm font-medium mb-6">
          Gross income:{" "}
          <p className="text-lg text-[#5762D5] mt-2">
            <span className="font-bold">
              {currency}{" "}
              {grossValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            / {viewMode}
          </p>
        </div>

        <div className="mb-6 border-gray-200 border-y-2 py-4">
          {/* Tax breakdown */}
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Pension</span>{" "}
              <span className="font-semibold">
                - {currency}{" "}
                {pension.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Health Insurance</span>{" "}
              <span className="font-semibold">
                - {currency}{" "}
                {health.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Nursing Care Insurance</span>{" "}
              <span className="font-semibold">
                - {currency}{" "}
                {care.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Unemployment Insurance</span>{" "}
              <span className="font-semibold">
                - {currency}{" "}
                {unemployment.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Income tax</span>{" "}
              <span className="font-semibold">
                - {currency}{" "}
                {incomeTax.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
          </ul>
        </div>

        {/* Total tax */}
        <div className="flex justify-between text-sm mb-4">
          <span>Total tax</span>
          <span className="text-[#5762D5] font-semibold">
            {currency}{" "}
            {totalTax.toLocaleString(undefined, { maximumFractionDigits: 2 })} /{" "}
            {viewMode}
          </span>
        </div>

        {/* Net income */}
        <div className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
          <div className="">
            <div className="font-bold text-sm text-[#5762D5]">Net income</div>
            <div className="text-lg font-bold text-[#5762D5]">
              {currency}{" "}
              {netIncome.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              / {viewMode}
            </div>
          </div>
          <div className="">
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
          If you make{" "}
          <strong>
            {currency} {grossValue.toLocaleString()}
          </strong>{" "}
          a {viewMode === "year" ? "year" : "month"} living in {countryName} you
          will be taxed{" "}
          <strong>
            {currency} {totalTax.toLocaleString()}
          </strong>
          . That means that your net pay will be{" "}
          <strong>
            {currency} {netIncomeYear.toLocaleString()}
          </strong>{" "}
          per year or{" "}
          <strong>
            {currency}{" "}
            {netIncomeMonth.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </strong>{" "}
          per month. Your average tax rate is{" "}
          <strong>{taxData.averageTaxRatePct}%</strong>.
        </p>

        {/* Percentage cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <div className="text-sm font-semibold">Net income</div>
            <div className="text-2xl font-bold text-[#5762D5]">
              {(100 - taxData.averageTaxRatePct).toFixed(1)}%
            </div>
            <div className="mt-2 flex justify-center flex-wrap">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i <
                    Math.round((20 * (100 - taxData.averageTaxRatePct)) / 100)
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
            <div className="text-sm font-semibold">Total tax</div>
            <div className="text-2xl font-bold text-red-600">
              {taxData.averageTaxRatePct.toFixed(1)}%
            </div>
            <div className="mt-2 flex justify-center flex-wrap">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.round((20 * taxData.averageTaxRatePct) / 100)
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
          NOTE: Withholding tax is calculated based on the tax tables applicable
          in Germany. For simplification purposes, some variables (such as tax
          class, tax allowances, solidarity surcharge, church tax, and others)
          have been assumed or may not be fully accounted for. This calculation
          does not represent legal authority and shall be used for approximation
          purposes only. For accurate income tax calculations, especially for
          individuals with complex financial situations, it is recommended to
          consult with a tax advisor.
        </p>
      </div>
    </div>
  );
}
