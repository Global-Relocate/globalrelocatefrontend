import data from "./data.json";

export function calculateDynamicTax(countryCode, grossIncome, period = "year") {
  const countryConfig = data[countryCode];
  if (!countryConfig) {
    throw new Error(`No tax config found for country: ${countryCode}`);
  }

  // Normalize to yearly
  const grossIncomeYear = period === "month" ? grossIncome * 12 : grossIncome;

  const yearlyBreakdown = countryConfig.taxes.map((tax) => {
    let value = 0;

    if (tax.brackets) {
      // progressive tax calculation
      const sortedLimits = Object.keys(tax.brackets)
        .map((k) => Number(k))
        .sort((a, b) => a - b);

      let calculatedTax = 0;
      for (let i = 0; i < sortedLimits.length; i++) {
        const limit = sortedLimits[i];
        const rate = tax.brackets[limit];
        const nextLimit =
          i + 1 < sortedLimits.length ? sortedLimits[i + 1] : Infinity;

        if (grossIncomeYear > limit) {
          const taxableIncome = Math.min(grossIncomeYear, nextLimit) - limit;
          calculatedTax += taxableIncome * rate;
        } else {
          break;
        }
      }
      value = calculatedTax;
    } else {
      value = grossIncomeYear * (tax.rate / 100);
    }

    return {
      [tax.name]: {
        rate: tax.rate || null,
        value,
        ...(tax.max
          ? {
              max: tax.max,
            }
          : {}),
      },
    };
  });

  const monthlyBreakdown = yearlyBreakdown.map((tax) => {
    const key = Object.keys(tax)[0];
    return {
      [key]: {
        rate: tax[key].rate,
        value: tax[key].value / 12,
        ...(tax[key].max
          ? {
              max: tax[key].max / 12,
            }
          : {}),
        ...(tax[key].brackets
          ? {
              brackets: tax[key].brackets,
            }
          : {}),
      },
    };
  });

  // Total tax
  const totalTax = yearlyBreakdown.reduce((sum, tax) => {
    const node = Object.values(tax)[0];
    const val = node.max ? Math.min(node.value, node.max) : node.value;
    return sum + (val || 0);
  }, 0);
  const solidaritySurchargePct = countryConfig.solidaritySurcharge || 0;
  const netIncomeYear = grossIncomeYear - totalTax;
  const averageTaxRate = (totalTax / grossIncomeYear) * 100;

  return {
    grossIncomeYear,
    taxes: yearlyBreakdown,
    monthlyTaxes: monthlyBreakdown,
    netIncomeYear,
    averageTaxRate,
    solidaritySurchargePct,
    totalTax,
    currency: countryConfig.currency,
    country: countryConfig.country,
  };
}
