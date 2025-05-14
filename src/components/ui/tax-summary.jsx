import { useTranslation } from "react-i18next";

const TaxSummary = ({
  country,
  currency,
  taxAmount,
  effectiveRate,
  exchangeRate,
  takeHomeAmount,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium">
        {t(`userDashboard.tax.taxSummary`)}
      </h2>
      <div className="bg-white rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tax Amount */}
          <div className="p-6 rounded-xl bg-[#EFF6FB]">
            <p className="text-sm text-gray-600">
              {t(`userDashboard.tax.taxAmount`)}
            </p>
            <h3 className="text-3xl font-semibold mt-2">
              {currency} {taxAmount.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              USD ${(taxAmount * exchangeRate).toLocaleString()}
            </p>
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
              {currency} {takeHomeAmount.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSummary;
