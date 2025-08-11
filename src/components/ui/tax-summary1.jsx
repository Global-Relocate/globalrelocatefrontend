import { useTranslation } from "react-i18next";

const TaxSummary = ({
  currency,
  taxAmount,
  effectiveRate,
  exchangeRate,
  takeHomeAmount,
}) => {
  const { t } = useTranslation();
  const currencySymbol = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
    JPY: "¥",
    INR: "₹",
    KRW: "₩",
    PHP: "₱",
    VND: "₫",
    CHF: "₣",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium">
        {t(`userDashboard.tax.taxSummary`)}
      </h2>
      <div className="bg-white rounded-xl p-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Tax Amount */}
          <div className="p-6 rounded-xl bg-[#EFF6FB]">
            <p className="text-sm text-gray-600">
              {t(`userDashboard.tax.taxAmount`)}
            </p>
            <h3 className="text-3xl font-semibold mt-2">
              {currencySymbol[currency]} {taxAmount.toLocaleString()}
            </h3>
            {currency !== "USD" && (
              <p className="text-sm text-gray-500 mt-1">
                USD ${(taxAmount * exchangeRate).toLocaleString()}
              </p>
            )}
          </div>

          {/* Effective Rate */}
          <div className="p-6 rounded-xl bg-[#FFF8EB]">
            <p className="text-sm text-gray-600">
              {t(`userDashboard.tax.effectiveRate`)}
            </p>
            <h3 className="text-3xl font-semibold mt-2">{effectiveRate}%</h3>
          </div>

          {/* Take Home Amount */}
          <div className="p-6 rounded-xl bg-[#EFFBF4]">
            <p className="text-sm text-gray-600">
              {t(`userDashboard.tax.takeHomeAmount`)}
            </p>
            <h3 className="text-3xl font-semibold mt-2">
              {currencySymbol[currency]} {takeHomeAmount.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-y-4">
          <div className="text-sm text-gray-500">
            {t("userDashboard.tax.disclaimer")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSummary;
