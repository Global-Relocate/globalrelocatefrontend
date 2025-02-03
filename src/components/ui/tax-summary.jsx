const TaxSummary = ({ taxAmount, effectiveRate, takeHomeAmount }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium">Tax summary</h2>
      <div className="bg-white rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tax Amount */}
          <div className="p-6 rounded-xl bg-[#EFF6FB]">
            <p className="text-sm text-gray-600">Tax amount</p>
            <h3 className="text-3xl font-semibold mt-2">£{taxAmount.toLocaleString()}</h3>
            <p className="text-sm text-gray-500 mt-1">
              USD ${(taxAmount * 1.27).toLocaleString()}
            </p>
          </div>

          {/* Effective Rate */}
          <div className="p-6 rounded-xl bg-[#FFF8EB]">
            <p className="text-sm text-gray-600">Effective rate</p>
            <h3 className="text-3xl font-semibold mt-2">{effectiveRate}%</h3>
          </div>

          {/* Take Home Amount */}
          <div className="p-6 rounded-xl bg-[#EFFBF4]">
            <p className="text-sm text-gray-600">Take home amount</p>
            <h3 className="text-3xl font-semibold mt-2">£{takeHomeAmount.toLocaleString()}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSummary; 