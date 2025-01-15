import SearchInput from "@/components/inputs/SearchInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import FilterButton from "@/components/utils/FilterButton";
import React from "react";

function TaxCalculator() {
  return (
    <DashboardLayout>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h2 className="text-3xl font-medium">Tax Calculator</h2>

        <div className="flex w-full sm:w-auto  items-center space-x-2">
          <SearchInput />
          <FilterButton />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaxCalculator;
