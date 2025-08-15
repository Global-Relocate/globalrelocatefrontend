import data from "./data.json";

export function calculateDynamicTax(countryCode, grossIncome, period = "year") {
  const countryConfig = data[countryCode];
  if (!countryConfig) {
    throw new Error(`No tax config found for country: ${countryCode}`);
  }

  // Normalize to yearly
  const grossIncomeYear = period === "month" ? grossIncome * 12 : grossIncome;

  // Calculate breakdown
  const yearlyBreakdown = countryConfig.taxes.map((tax) => ({
    [tax.name]: {
      rate: tax.rate,
      value: grossIncomeYear * (tax.rate / 100),
    },
  }));

  const monthlyBreakdown = yearlyBreakdown.map((tax) => {
    const key = Object.keys(tax)[0];
    return {
      [key]: {
        rate: tax[key].rate,
        value: tax[key].value / 12,
      },
    };
  });

  // Total tax
  const totalTax = yearlyBreakdown.reduce(
    (sum, tax) => sum + Object.values(tax)[0].value,
    0
  );

  const netIncomeYear = grossIncomeYear - totalTax;
  const averageTaxRate = (totalTax / grossIncomeYear) * 100;

  return {
    grossIncomeYear,
    taxes: yearlyBreakdown,
    monthlyTaxes: monthlyBreakdown,
    netIncomeYear,
    averageTaxRate,
    totalTax,
    currency: countryConfig.currency,
    country: countryConfig.country,
  };
}
