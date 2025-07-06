/**
 * Note: Tax data is simplified for demonstration purposes and may not be fully accurate or up-to-date.
 * This data does not constitute financial advice. Consult a tax professional for accurate information.
 * All figures are for a single individual and may not account for all deductions, credits, or regional taxes.
 * Last updated based on available 2024 data.
 */
export const taxData = [
  {
    country: "US",
    taxClasses: [
      {
        name: "Federal Personal Income Tax (Single Filer, 2024)",
        brackets: [
          { min: 0, max: 11600, rate: 0.1 },
          { min: 11601, max: 47150, rate: 0.12 },
          { min: 47151, max: 100525, rate: 0.22 },
          { min: 100526, max: 191950, rate: 0.24 },
          { min: 191951, max: 243725, rate: 0.32 },
          { min: 243726, max: 609350, rate: 0.35 },
          { min: 609351, max: null, rate: 0.37 },
        ],
        // Standard deduction for a single filer in 2024.
        deductions: 14600,
      },
      {
        name: "Corporate Tax",
        brackets: [{ min: 0, max: null, rate: 0.21 }],
        deductions: 0,
      },
    ],
  },
  {
    country: "CA",
    taxClasses: [
      {
        name: "Federal Income Tax (2024)",
        brackets: [
          { min: 0, max: 55867, rate: 0.15 },
          { min: 55868, max: 111733, rate: 0.205 },
          { min: 111734, max: 173205, rate: 0.26 },
          { min: 173206, max: 246752, rate: 0.29 },
          { min: 246753, max: null, rate: 0.33 },
        ],
        // Basic Personal Amount for 2024 (can be higher for lower incomes).
        deductions: 15705,
      },
    ],
  },
  {
    country: "DE",
    taxClasses: [
      {
        name: "Income Tax (2024)",
        // German tax is a formula, these brackets are an approximation.
        brackets: [
          { min: 0, max: 11604, rate: 0 }, // Grundfreibetrag (tax-free allowance)
          { min: 11605, max: 66760, rate: 0.14 }, // Progressive rate from 14% up to 42%
          { min: 66761, max: 277825, rate: 0.42 }, // Top tax rate
          { min: 277826, max: null, rate: 0.45 }, // Reichensteuer (wealth tax)
        ],
        // Deductions are highly individualized in Germany.
        deductions: 1260, // Pauschbetrag (lump sum for work-related expenses)
      },
    ],
  },
  {
    country: "NG",
    taxClasses: [
      {
        name: "Personal Income Tax (PIT)",
        brackets: [
          { min: 0, max: 300000, rate: 0.07 },
          { min: 300001, max: 600000, rate: 0.11 },
          { min: 600001, max: 1100000, rate: 0.15 },
          { min: 1100001, max: 1600000, rate: 0.19 },
          { min: 1600001, max: 3200000, rate: 0.21 },
          { min: 3200001, max: null, rate: 0.24 },
        ],
        // Consolidated Relief Allowance (CRA) is the greater of NGN 200,000 or 1% of gross income, plus 20% of gross income.
        // This is a placeholder; a function would be needed to calculate it accurately.
        deductions: 200000,
      },
    ],
  },
];
