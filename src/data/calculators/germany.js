export function calculateGermanyTax(grossYear, opts) {
  const {
    maritalStatus = "single",
    healthAdditionalRate = 0.0245,
    healthTotalRate = null,
    careTotalRate = 0.042,
    careChildlessSurcharge = 0,
    churchTaxRate = 0,
  } = opts || {};

  const grundfreibetrag = 12096;
  const healthBBG = 66150;
  const pensionBBG = 96600;
  const unemploymentBBG = pensionBBG;
  const pensionTotal = 0.186;
  const unemploymentTotal = 0.026;
  const healthBase = 0.146;
  const healthTotal = healthTotalRate ?? healthBase + healthAdditionalRate;
  const careTotal = careTotalRate;

  const pensionEmployeeRate = pensionTotal / 2;
  const unemploymentEmployeeRate = unemploymentTotal / 2;
  const healthEmployeeRate = healthTotal / 2;
  const careEmployeeRate = careTotal / 2 + careChildlessSurcharge;

  let zvE_for_formula = grossYear;

  if (maritalStatus === "married") {
    // splitting: you normally divide combined income by 2, compute tax on half, then *2.
    // Here we just implement handling in incomeTax function.
    // We'll compute tax for half and multiply by 2 below.
  }

  function incomeTaxForSingle(zvE) {
    const z = zvE;
    let ESt = 0;

    if (z <= 12096) {
      ESt = 0;
    } else if (z <= 17443) {
      const y = (z - 12096) / 10000;
      ESt = (932.3 * y + 1400) * y;
    } else if (z <= 68480) {
      const y = (z - 17443) / 10000;
      ESt = (176.64 * y + 2397) * y + 1015.13;
    } else if (z <= 277825) {
      ESt = 0.42 * z - 10911.92;
    } else {
      ESt = 0.45 * z - 19246.67;
    }

    return Math.floor(ESt);
  }

  let incomeTax = 0;
  if (maritalStatus === "single") {
    incomeTax = incomeTaxForSingle(grossYear);
  } else {
    const half = grossYear / 2;
    incomeTax = 2 * incomeTaxForSingle(half);
  }

  const soliThresholdSingle = 19950;
  const soliThresholdMarried = soliThresholdSingle * 2;
  const soli =
    incomeTax <=
    (maritalStatus === "single" ? soliThresholdSingle : soliThresholdMarried)
      ? 0
      : Math.round(incomeTax * 0.055);

  const churchTax = Math.round(incomeTax * churchTaxRate);

  const pensionBase = Math.min(grossYear, pensionBBG);
  const unemploymentBase = Math.min(grossYear, unemploymentBBG);
  const healthBaseAmount = Math.min(grossYear, healthBBG);
  const careBase = Math.min(grossYear, healthBBG);

  const pensionEmployee = Math.round(pensionBase * pensionEmployeeRate);
  const unemploymentEmployee = Math.round(
    unemploymentBase * unemploymentEmployeeRate
  );
  const healthEmployee = Math.round(healthBaseAmount * healthEmployeeRate);
  const careEmployee = Math.round(careBase * careEmployeeRate);

  const totalSocial =
    pensionEmployee + unemploymentEmployee + healthEmployee + careEmployee;

  const totalTax = Math.round(incomeTax + soli + churchTax + totalSocial);
  const netIncomeYear = Math.round(grossYear - totalTax);
  const averageTaxRatePct = (totalTax / grossYear) * 100;

  return {
    grossIncomeYear: Math.round(grossYear),
    zvE: Math.round(grossYear),
    incomeTax: Math.round(incomeTax),
    solidaritySurcharge: Math.round(soli),
    churchTax: Math.round(churchTax),
    social: {
      pensionEmployee,
      unemploymentEmployee,
      healthEmployee,
      careEmployee,
      totalSocialEmployee: totalSocial,
    },
    totalTax,
    netIncomeYear,
    averageTaxRatePct: Number(averageTaxRatePct.toFixed(2)),
  };
}
