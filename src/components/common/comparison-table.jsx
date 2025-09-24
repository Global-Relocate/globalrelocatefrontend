import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

export default function ComparisonTable({ data }) {
  const { comparison, summary, recommendations } = data;
  const { t } = useTranslation();

  // Extract all row keys except `country`
  const attributes = Object.keys(comparison[0]).filter((k) => k !== "country");

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <Table className="min-w-full border border-gray-200">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="p-3 text-left font-semibold">
                {t("userDashboard.compareCountries.attribute")}
              </TableHead>
              {comparison.map((c, idx) => (
                <TableHead key={idx} className="p-3 text-left font-semibold">
                  {c.country}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map((attr) => (
              <TableRow key={attr} className="border-t">
                <TableCell className="p-3 font-medium">
                  {t(`userDashboard.compareCountries.${attr}`)}
                </TableCell>
                {comparison.map((c, idx) => {
                  const value = c[attr];
                  return (
                    <TableCell key={idx} className="p-3">
                      {Array.isArray(value) ? value.join(", ") : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">
          {t("userDashboard.compareCountries.summary")}
        </h2>
        <p>{summary}</p>
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">
          {t("userDashboard.compareCountries.recommendations")}
        </h2>
        <ul className="space-y-2">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="border-l-4 border-green-500 pl-3">
              <strong>{rec.category}:</strong> {rec.bestCountry} — {rec.reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ComparisonTable.propTypes = {
  data: PropTypes.shape({
    comparison: PropTypes.arrayOf(PropTypes.object).isRequired,
    summary: PropTypes.string.isRequired,
    recommendations: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};
