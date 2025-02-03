import DashboardLayout from "@/components/layouts/DashboardLayout";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Icons
import { PiGlobeHemisphereWestLight } from "react-icons/pi";
import { PiMoneyLight } from "react-icons/pi";
import { FiMinusCircle } from "react-icons/fi";
import { PiUsers } from "react-icons/pi";

function TaxCalculator() {
  const [formData, setFormData] = useState({
    country: "",
    annualIncome: "",
    familyStatus: "",
    totalDeductions: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.country &&
      formData.annualIncome &&
      formData.familyStatus &&
      formData.totalDeductions
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="overflow-hidden rounded-2xl">
          {/* Header Section - Purple background */}
          <div className="bg-[#5762D5] text-white px-6 py-8">
            <h2 className="text-3xl font-medium">Tax Calculator</h2>
            <p className="text-base mt-1 opacity-90">
              Calculate your estimated tax burden across different countries
            </p>
          </div>

          {/* Form Section - Grey background */}
          <div className="bg-[#F8F8F8] px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <PiGlobeHemisphereWestLight className="text-lg" />
                  Country
                </label>
                <CountryDropdown
                  value={formData.country}
                  onChange={(country) => handleInputChange("country", country.alpha2)}
                  placeholder="Select your country"
                />
              </div>

              {/* Annual Income */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <PiMoneyLight className="text-lg" />
                  Annual income
                </label>
                <Input
                  type="number"
                  placeholder="Enter your annual income"
                  value={formData.annualIncome}
                  onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                  className="h-12 bg-white"
                />
              </div>

              {/* Family Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <PiUsers className="text-lg" />
                  Family status
                </label>
                <Select
                  value={formData.familyStatus}
                  onValueChange={(value) => handleInputChange("familyStatus", value)}
                >
                  <SelectTrigger className="h-12 bg-white">
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total Deductions */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FiMinusCircle className="text-lg" />
                  Total deductions
                </label>
                <Input
                  type="number"
                  placeholder="Enter total deductions"
                  value={formData.totalDeductions}
                  onChange={(e) =>
                    handleInputChange("totalDeductions", e.target.value)
                  }
                  className="h-12 bg-white"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-6 flex justify-end">
              <Button
                disabled={!isFormValid()}
                className="w-full sm:w-auto px-8 bg-black hover:bg-black/90 text-white rounded-lg"
                size="lg"
              >
                Calculate Tax
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaxCalculator;
