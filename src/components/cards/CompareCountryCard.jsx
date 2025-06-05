import { MdAdd, MdClose } from "react-icons/md";
import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const CompareCountryCard = ({
  onOpen,
  countryData,
  idx,
  onRemove,
  isAdditionalCard,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex item-center justify-center border border-dashed border-gray-300 rounded-lg w-full h-[208px] relative">
      {isAdditionalCard && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <MdClose className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {countryData[idx] ? (
        <div className="w-full flex-col items-start flex p-4 justify-between">
          <div className="flex w-full items-start justify-between">
            <img
              src={
                countryData[idx]?.name === "Afghanistan"
                  ? "https://flagcdn.com/w320/af.png"
                  : countryData[idx]?.flag
              }
              className="bg-gray-200 w-16 h-16 object-cover border rounded-full"
              alt={countryData[idx]?.name}
            />
            <button
              onClick={() => onOpen(idx)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-lg font-medium text-black">
              {countryData[idx]?.name}
            </span>
            <span className="text-sm text-gray-500">
              {countryData[idx]?.continent}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col">
          <button
            onClick={() => onOpen(idx)}
            className="p-4 w-max rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <MdAdd className="w-5 h-5 text-gray-600" />
          </button>
          <span className="mt-2 text-sm text-gray-600">
            {t("userDashboard.countries.clickToSelect")}
          </span>
        </div>
      )}
    </div>
  );
};

CompareCountryCard.propTypes = {
  onOpen: PropTypes.func.isRequired,
  countryData: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  onRemove: PropTypes.func,
  isAdditionalCard: PropTypes.bool,
};

export default CompareCountryCard;
