"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import TaxSummary from "@/components/ui/tax-summary";
import { calculateTaxAPI } from "@/services/api";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Zod schema (used for validation only) - mirrors the JSON schema you provided.
 * Note: we use z.coerce where user input is a string but must be numeric.
 */
const schema = z.object({
  description: z.string(),
  employeeInputs: z.object({
    grossSalaryMonthlyEUR: z.coerce
      .number()
      .positive("Gross salary is required and must be > 0"),
    accountingPeriod: z.enum(["Monthly", "Yearly"]),
    taxYearSelection: z.string().nonempty(),
    employeeAge: z.coerce.number().min(16, "Age must be >= 16"),
    annualTaxAllowanceEUR: z.coerce.number().min(0),
    monetaryBenefitsMonthlyEUR: z.coerce.number().min(0),
  }),
  familyAndTaxStatus: z.object({
    maritalStatusDetails: z.object({
      status: z.enum(["Unmarried", "Married", "Divorced", "Widowed"]),
      taxClass: z.enum(["I", "II", "III", "IV", "V", "VI"]),
      isSoleWageEarner: z.boolean().optional(),
      isDualWageEarner: z.boolean().optional(),
      widowedSpouseDeathYear: z
        .union([
          z.coerce
            .number()
            .int()
            .optional(),
          z.null(),
        ])
        .nullable()
        .optional(),
    }),
    spouseTaxClass: z.union([
      z.enum(["III", "IV", "V"]),
      z.null(),
      z.string().optional(),
    ]),
    hasChildren: z.boolean(),
    childrenU25Count: z.coerce
      .number()
      .min(0)
      .max(6),
    childAllowanceFactor: z.coerce
      .number()
      .min(0)
      .max(6),
  }),
  insuranceAndSurcharges: z
    .object({
      state: z.string().nonempty(),
      churchTaxLiability: z.object({
        isLiable: z.boolean(),
      }),
      healthInsurance: z.object({
        type: z.enum([
          "CompulsoryStatutory",
          "PrivatelyInsured",
          "VoluntarilyInsuredByLaw",
        ]),
        statutoryDetails: z.object({
          additionalContributionName: z.string().optional(),
          additionalContributionRatePercent: z.coerce
            .number()
            .min(0)
            .optional(),
        }),
        privateDetails: z.object({
          monthlyPremiumEUR: z.coerce
            .number()
            .min(0)
            .optional(),
          employerParticipation: z.boolean().optional(),
        }),
        voluntaryDetails: z.object({
          // spelled per your schema ("voluntaryDetails")
          additionalContributionName: z.string().optional(),
          additionalContributionRatePercent: z.coerce
            .number()
            .min(0)
            .optional(),
        }),
      }),
      pensionScheme: z.enum([
        "NotCompulsorilyInsured",
        "CompulsoryStatutoryInsurance",
        "OnlyEmployerCompulsoryShare",
        "OnlyEmployeeCompulsoryShare",
      ]),
      unemploymentInsurance: z.enum([
        "NotCompulsorilyInsured",
        "CompulsoryStatutoryInsurance",
        "OnlyEmployerCompulsoryShare",
        "OnlyEmployeeCompulsoryShare",
      ]),
      occupationalPensionMonthlyEUR: z.coerce
        .number()
        .min(0)
        .optional(),
      surcharges: z.object({
        U1_rate_percent: z.coerce
          .number()
          .min(0)
          .optional(),
        U2_rate_percent: z.coerce
          .number()
          .min(0)
          .optional(),
      }),
      bgContributionRatePercent: z.coerce
        .number()
        .min(0)
        .optional(),
    })
    .superRefine((val, ctx) => {
      // Additional runtime checks: if churchTaxLiability.isLiable true, nothing to require here because your schema only stores isLiable.
      // If healthInsurance.type === 'PrivatelyInsured' ensure privateDetails.monthlyPremiumEUR exists (basic check)
      if (val.healthInsurance?.type === "PrivatelyInsured") {
        const mp = val.healthInsurance.privateDetails?.monthlyPremiumEUR;
        if (mp === undefined || Number.isNaN(mp)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Private monthly premium is required for PrivatelyInsured type",
            path: ["healthInsurance", "privateDetails", "monthlyPremiumEUR"],
          });
        }
      }
    }),
});

export default function TaxCalculator() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [taxSummary, setTaxSummary] = useState(null);
  const taxSummaryRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      description:
        "Input schema for German tax and social contribution calculation.",
      employeeInputs: {
        grossSalaryMonthlyEUR: 4500.0,
        accountingPeriod: "Monthly",
        taxYearSelection: "2025",
        employeeAge: 35,
        annualTaxAllowanceEUR: 0.0,
        monetaryBenefitsMonthlyEUR: 150.0,
      },
      familyAndTaxStatus: {
        maritalStatusDetails: {
          status: "Married",
          taxClass: "III",
          isSoleWageEarner: true,
          isDualWageEarner: false,
          widowedSpouseDeathYear: null,
        },
        spouseTaxClass: "V",
        hasChildren: true,
        childrenU25Count: 1,
        childAllowanceFactor: 0.5,
      },
      insuranceAndSurcharges: {
        state: "Nordrhein-Westfalen",
        churchTaxLiability: { isLiable: true },
        healthInsurance: {
          type: "CompulsoryStatutory",
          statutoryDetails: {
            additionalContributionName: "AOK Bayern",
            additionalContributionRatePercent: 2.69,
          },
          privateDetails: {
            monthlyPremiumEUR: 0.0,
            employerParticipation: false,
          },
          voluntaryDetails: {
            additionalContributionName: "AOK Bayern",
            additionalContributionRatePercent: 2.69,
          },
        },
        pensionScheme: "CompulsoryStatutoryInsurance",
        unemploymentInsurance: "CompulsoryStatutoryInsurance",
        occupationalPensionMonthlyEUR: 483.0,
        surcharges: {
          U1_rate_percent: 0.5,
          U2_rate_percent: 0.24,
        },
        bgContributionRatePercent: 1.5,
      },
    },
  });

  const watched = watch();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await calculateTaxAPI(data);
      setTaxSummary({
        taxData: res.data.output,
        countryCode: "DE",
        countryFlag: "🇩🇪",
      });
      setLoading(false);
      taxSummaryRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setLoading(false);
    }
  };

  const FieldErr = ({ path }) => {
    // utility to display nested errors by path string like "employeeInputs.grossSalaryMonthlyEUR"
    const segments = path.split(".");
    let obj = errors;
    for (const seg of segments) {
      if (!obj) break;
      obj = obj[seg];
    }
    const message = obj?.message || (obj?._errors && obj._errors[0]);
    return message ? (
      <p className="text-xs text-red-500 mt-1">{message}</p>
    ) : null;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* Form column */}
        <div className="w-full rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="bg-[#5762D5] text-white px-6 py-6">
            <h2 className="text-2xl font-semibold">
              {t("userDashboard.tax.taxCalculator") || "Tax Calculator"}
            </h2>
            <p className="text-sm mt-1 opacity-90">
              {t("userDashboard.tax.taxCalculatorDesc") ||
                "Calculate German taxes & social contributions."}
            </p>
          </div>

          <div className="bg-[#F8F8F8] px-6 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Accordion
                type="single"
                defaultValue="emp"
                collapsible
                className="space-y-4"
              >
                {/* Employee Inputs */}
                <AccordionItem value="emp">
                  <AccordionTrigger className="text-left">
                    {t("userDashboard.tax.employeeInputs")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.grossSalary")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register("employeeInputs.grossSalaryMonthlyEUR")}
                        />
                        <FieldErr path="employeeInputs.grossSalaryMonthlyEUR" />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.accountingPeriod")}
                        </label>
                        <Select
                          defaultValue={
                            watched.employeeInputs?.accountingPeriod ||
                            "Monthly"
                          }
                          onValueChange={(v) =>
                            setValue("employeeInputs.accountingPeriod", v)
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={t(
                                "userDashboard.tax.accountingPeriod"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monthly">
                              {t("userDashboard.tax.monthly")}
                            </SelectItem>
                            <SelectItem value="Yearly">
                              {t("userDashboard.tax.yearly")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldErr path="employeeInputs.accountingPeriod" />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.taxYearSelection")}
                        </label>
                        <Select
                          defaultValue={
                            watched.employeeInputs?.taxYearSelection || "2025"
                          }
                          onValueChange={(v) =>
                            setValue("employeeInputs.taxYearSelection", v)
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={t(
                                "userDashboard.tax.taxYearSelection"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024 (12/24)">
                              2024 (12/24)
                            </SelectItem>
                            <SelectItem value="2024 (until 11/24)">
                              2024 (until 11/24)
                            </SelectItem>
                            <SelectItem value="2023 (from 7/23)">
                              2023 (from 7/23)
                            </SelectItem>
                            <SelectItem value="2023 (until 6/23)">
                              2023 (until 6/23)
                            </SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldErr path="employeeInputs.taxYearSelection" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.age")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          {...register("employeeInputs.employeeAge")}
                        />
                        <FieldErr path="employeeInputs.employeeAge" />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.annualTaxAllowance")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register("employeeInputs.annualTaxAllowanceEUR")}
                        />
                        <FieldErr path="employeeInputs.annualTaxAllowanceEUR" />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.monetaryBenefitsMonthly")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register(
                            "employeeInputs.monetaryBenefitsMonthlyEUR"
                          )}
                        />
                        <FieldErr path="employeeInputs.monetaryBenefitsMonthlyEUR" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Family & Tax Status */}
                <AccordionItem value="family">
                  <AccordionTrigger className="text-left">
                    {t("userDashboard.tax.familyAndTaxStatus")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.maritalStatus")}
                        </label>
                        <Select
                          defaultValue={
                            watched.familyAndTaxStatus?.maritalStatusDetails
                              ?.status || "Unmarried"
                          }
                          onValueChange={(v) =>
                            setValue(
                              "familyAndTaxStatus.maritalStatusDetails.status",
                              v
                            )
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={t("userDashboard.tax.maritalStatus")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unmarried">
                              {t(
                                "userDashboard.tax.maritalStatusOptions.single"
                              )}
                            </SelectItem>
                            <SelectItem value="Married">
                              {t(
                                "userDashboard.tax.maritalStatusOptions.married"
                              )}
                            </SelectItem>
                            <SelectItem value="Divorced">
                              {t(
                                "userDashboard.tax.maritalStatusOptions.divorced"
                              )}
                            </SelectItem>
                            <SelectItem value="Widowed">
                              {t(
                                "userDashboard.tax.maritalStatusOptions.widowed"
                              )}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldErr path="familyAndTaxStatus.maritalStatusDetails.status" />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.taxClass")}
                        </label>
                        <Select
                          defaultValue={
                            watched.familyAndTaxStatus?.maritalStatusDetails
                              ?.taxClass || "I"
                          }
                          onValueChange={(v) =>
                            setValue(
                              "familyAndTaxStatus.maritalStatusDetails.taxClass",
                              v
                            )
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={t("userDashboard.tax.taxClass")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="I">I</SelectItem>
                            <SelectItem value="II">II</SelectItem>
                            <SelectItem value="III">III</SelectItem>
                            <SelectItem value="IV">IV</SelectItem>
                            <SelectItem value="V">V</SelectItem>
                            <SelectItem value="VI">VI</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldErr path="familyAndTaxStatus.maritalStatusDetails.taxClass" />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.spouseTaxClass")}
                        </label>
                        {/* show spouse tax class only when Married */}
                        <Select
                          defaultValue={
                            watched.familyAndTaxStatus?.spouseTaxClass || ""
                          }
                          onValueChange={(v) =>
                            setValue(
                              "familyAndTaxStatus.spouseTaxClass",
                              v || null
                            )
                          }
                          disabled={
                            watched.familyAndTaxStatus?.maritalStatusDetails
                              ?.status !== "Married"
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={
                                watched.familyAndTaxStatus?.maritalStatusDetails
                                  ?.status === "Married"
                                  ? t("userDashboard.tax.spouseTaxClass")
                                  : "N/A"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="III">III</SelectItem>
                            <SelectItem value="IV">IV</SelectItem>
                            <SelectItem value="V">V</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.hasChildren")}
                        </label>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={
                              watched.familyAndTaxStatus?.hasChildren ?? false
                            }
                            onCheckedChange={(v) =>
                              setValue("familyAndTaxStatus.hasChildren", v)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.childrenU25Count")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          {...register("familyAndTaxStatus.childrenU25Count")}
                          min={0}
                          max={6}
                        />
                        <FieldErr path="familyAndTaxStatus.childrenU25Count" />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.childAllowanceFactor")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.5"
                          {...register(
                            "familyAndTaxStatus.childAllowanceFactor"
                          )}
                        />
                        <FieldErr path="familyAndTaxStatus.childAllowanceFactor" />
                      </div>
                    </div>

                    {/* Additional marital-specific fields */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {watched.familyAndTaxStatus?.maritalStatusDetails
                        ?.taxClass === "III" && (
                        <>
                          <div className="space-y-3">
                            <label className="block text-sm font-medium mb-1">
                              {t("userDashboard.tax.isSoleWageEarner")}
                            </label>
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={
                                  watched.familyAndTaxStatus
                                    ?.maritalStatusDetails?.isSoleWageEarner ??
                                  false
                                }
                                onCheckedChange={(v) =>
                                  setValue(
                                    "familyAndTaxStatus.maritalStatusDetails.isSoleWageEarner",
                                    v
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="block text-sm font-medium mb-1">
                              {t("userDashboard.tax.isDualWageEarner")}
                            </label>
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={
                                  watched.familyAndTaxStatus
                                    ?.maritalStatusDetails?.isDualWageEarner ??
                                  false
                                }
                                onCheckedChange={(v) =>
                                  setValue(
                                    "familyAndTaxStatus.maritalStatusDetails.isDualWageEarner",
                                    v
                                  )
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {watched.familyAndTaxStatus?.maritalStatusDetails
                        ?.status === "Widowed" && (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium mb-1">
                            {t("userDashboard.tax.widowedSpouseDeathYear")}
                          </label>
                          <Input
                            type="number"
                            className="h-12"
                            {...register(
                              "familyAndTaxStatus.maritalStatusDetails.widowedSpouseDeathYear"
                            )}
                            placeholder={t(
                              "userDashboard.tax.widowedSpouseDeathYear"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Insurance & Surcharges */}
                <AccordionItem value="insurance">
                  <AccordionTrigger className="text-left">
                    {t("userDashboard.tax.insuranceAndSurcharges")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.state")}
                        </label>
                        <Select
                          defaultValue={
                            watched.insuranceAndSurcharges?.state ||
                            "Nordrhein-Westfalen"
                          }
                          onValueChange={(v) =>
                            setValue("insuranceAndSurcharges.state", v)
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={t("userDashboard.tax.state")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Baden-Wurttemberg",
                              "Bayern",
                              "Berlin",
                              "Brandenburg",
                              "Bremen",
                              "Hamburg",
                              "Hessen",
                              "Mecklenburg-Vorpommern",
                              "Niedersachsen",
                              "Nordrhein-Westfalen",
                              "Rheinland-Pfalz",
                              "Saarland",
                              "Sachsen",
                              "Sachsen-Anhalt",
                              "Schleswig-Holstein",
                              "Thuringen",
                            ].map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.churchTaxLiability")}
                        </label>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={
                              watched.insuranceAndSurcharges?.churchTaxLiability
                                ?.isLiable ?? false
                            }
                            onCheckedChange={(v) => {
                              setValue(
                                "insuranceAndSurcharges.churchTaxLiability.isLiable",
                                v
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.healthInsurance")}
                        </label>
                        <Select
                          defaultValue={
                            watched.insuranceAndSurcharges?.healthInsurance
                              ?.type || "CompulsoryStatutory"
                          }
                          onValueChange={(v) =>
                            setValue(
                              "insuranceAndSurcharges.healthInsurance.type",
                              v
                            )
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={t(
                                "userDashboard.tax.healthInsurance"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CompulsoryStatutory">
                              {t(
                                "userDashboard.tax.healthInsuranceTypes.compulsoryStatutory"
                              )}
                            </SelectItem>
                            <SelectItem value="PrivatelyInsured">
                              {t(
                                "userDashboard.tax.healthInsuranceTypes.privatelyInsured"
                              )}
                            </SelectItem>
                            <SelectItem value="VoluntarilyInsuredByLaw">
                              {t(
                                "userDashboard.tax.healthInsuranceTypes.voluntarilyInsuredByLaw"
                              )}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.additionalContributionName")}
                        </label>
                        <Input
                          {...register(
                            "insuranceAndSurcharges.healthInsurance.statutoryDetails.additionalContributionName"
                          )}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.additionalContributionRate")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register(
                            "insuranceAndSurcharges.healthInsurance.statutoryDetails.additionalContributionRatePercent"
                          )}
                        />
                      </div>
                    </div>

                    {/* Private-only fields */}
                    {watched.insuranceAndSurcharges?.healthInsurance?.type ===
                      "PrivatelyInsured" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-3">
                          <label className="block text-sm font-medium mb-1">
                            {t("userDashboard.tax.monthlyPremium")}
                          </label>
                          <Input
                            type="number"
                            className="h-12"
                            step="0.01"
                            {...register(
                              "insuranceAndSurcharges.healthInsurance.privateDetails.monthlyPremiumEUR"
                            )}
                          />
                          <FieldErr path="insuranceAndSurcharges.healthInsurance.privateDetails.monthlyPremiumEUR" />
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium mb-1">
                            {t("userDashboard.tax.employerParticipation")}
                          </label>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={
                                watched.insuranceAndSurcharges?.healthInsurance
                                  ?.privateDetails?.employerParticipation ??
                                false
                              }
                              onCheckedChange={(v) =>
                                setValue(
                                  "insuranceAndSurcharges.healthInsurance.privateDetails.employerParticipation",
                                  v
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.voluntaryContribution")}
                        </label>
                        <Input
                          {...register(
                            "insuranceAndSurcharges.healthInsurance.voluntaryDetails.additionalContributionName"
                          )}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.voluntaryContributionRate")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register(
                            "insuranceAndSurcharges.healthInsurance.voluntaryDetails.additionalContributionRatePercent"
                          )}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.pensionScheme.title")}
                        </label>
                        <Select
                          defaultValue={
                            watched.insuranceAndSurcharges?.pensionScheme ||
                            "CompulsoryStatutoryInsurance"
                          }
                          onValueChange={(v) =>
                            setValue("insuranceAndSurcharges.pensionScheme", v)
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={t(
                                "userDashboard.tax.pensionScheme.title"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CompulsoryStatutoryInsurance">
                              {t(
                                "userDashboard.tax.pensionScheme.compulsoryStatutoryInsurance"
                              )}
                            </SelectItem>
                            <SelectItem value="NotCompulsorilyInsured">
                              {t(
                                "userDashboard.tax.pensionScheme.notCompulsorilyInsured"
                              )}
                            </SelectItem>
                            <SelectItem value="OnlyEmployerCompulsoryShare">
                              {t(
                                "userDashboard.tax.pensionScheme.onlyEmployerCompulsoryShare"
                              )}
                            </SelectItem>
                            <SelectItem value="OnlyEmployeeCompulsoryShare">
                              {t(
                                "userDashboard.tax.pensionScheme.onlyEmployeeCompulsoryShare"
                              )}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.unemploymentInsurance")}
                        </label>
                        <Select
                          defaultValue={
                            watched.insuranceAndSurcharges
                              ?.unemploymentInsurance ||
                            "CompulsoryStatutoryInsurance"
                          }
                          onValueChange={(v) =>
                            setValue(
                              "insuranceAndSurcharges.unemploymentInsurance",
                              v
                            )
                          }
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={t(
                                "userDashboard.tax.unemploymentInsurance"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CompulsoryStatutoryInsurance">
                              {t(
                                "userDashboard.tax.pensionScheme.compulsoryStatutoryInsurance"
                              )}
                            </SelectItem>
                            <SelectItem value="NotCompulsorilyInsured">
                              {t(
                                "userDashboard.tax.pensionScheme.notCompulsorilyInsured"
                              )}
                            </SelectItem>
                            <SelectItem value="OnlyEmployerCompulsoryShare">
                              {t(
                                "userDashboard.tax.pensionScheme.onlyEmployerCompulsoryShare"
                              )}
                            </SelectItem>
                            <SelectItem value="OnlyEmployeeCompulsoryShare">
                              {t(
                                "userDashboard.tax.pensionScheme.onlyEmployeeCompulsoryShare"
                              )}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.occupationalPensionMonthly")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register(
                            "insuranceAndSurcharges.occupationalPensionMonthlyEUR"
                          )}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.U1_rate_percent")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register(
                            "insuranceAndSurcharges.surcharges.U1_rate_percent"
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.U2_rate_percent")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register(
                            "insuranceAndSurcharges.surcharges.U2_rate_percent"
                          )}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">
                          {t("userDashboard.tax.bgContributionRate")}
                        </label>
                        <Input
                          type="number"
                          className="h-12"
                          step="0.01"
                          {...register(
                            "insuranceAndSurcharges.bgContributionRatePercent"
                          )}
                        />
                      </div>
                      <div />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="px-8 bg-black text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    t("userDashboard.tax.calculateTax") || "Calculate"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-5/12">
          <h3 className="text-xl font-semibold">
            <i className="far fa-info-circle mr-2" />
            {t("userDashboard.tax.usageGuide") || "Usage Guide"}
          </h3>
          <div className="text-sm text-gray-600 mt-4">
            <ul className="list-disc ml-5 space-y-2">
              <li>
                {t("userDashboard.tax.usageGuide1") ||
                  "Provide gross salary and select the tax year."}
              </li>
              <li>
                {t("userDashboard.tax.usageGuide2") ||
                  "Fill family & tax status to determine allowances."}
              </li>
              <li>
                {t("userDashboard.tax.usageGuide3") ||
                  "Complete health & social insurance details."}
              </li>
              <li>
                {t("userDashboard.tax.usageGuide4") ||
                  "Click Calculate to get the tax summary."}
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Tax Summary */}
      {taxSummary && (
        <div ref={taxSummaryRef} className="mt-8">
          <TaxSummary {...taxSummary} />
        </div>
      )}
    </DashboardLayout>
  );
}
