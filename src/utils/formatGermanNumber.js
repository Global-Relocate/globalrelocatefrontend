export const formatGermanNumber = (value, language) => {
  if (!value) return value;

  // Check if language is German
  const isGerman =
    language?.code?.toLowerCase() === "deu" ||
    language?.code?.toLowerCase()?.startsWith("de");

  if (!isGerman) {
    // Convert to string if it's a number
    const stringValue = typeof value === "number" ? value.toString() : value;

    // Split into integer and decimal parts
    const parts = stringValue.split(",");
    let integerPart = parts[0];
    const decimalPart = parts[1] || "";

    // Add thousands separator (.) to integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine with German decimal separator (,)
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  }

  // Convert to string if it's a number
  const stringValue = typeof value === "number" ? value.toString() : value;

  // Split into integer and decimal parts
  const parts = stringValue.split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1] || "";

  // Add thousands separator (.) to integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Combine with German decimal separator (,)
  return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
};
