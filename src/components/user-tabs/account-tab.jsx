import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CountdownTimer from "../common/CountdownTimer";

const AccountTab = ({ user }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="px-8 py-6 h-full">
      <h2 className="text-xl font-medium mb-8 text-left">
        {t("userDashboard.settings.account")}
      </h2>

      <div
        className="space-y-8 overflow-y-auto"
        style={{ maxHeight: "calc(90vh - 5rem)" }}
      >
        <div>
          <h3 className="text-sm text-gray-600 mb-2">
            {t("userDashboard.settings.emailAddress")}
          </h3>
          <div className="flex items-center">
            <span className="text-sm">{user?.email}</span>
            <span className="ml-2 text-green-600 text-sm">
              ({t("userDashboard.settings.verified").toLowerCase()})
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-600 mb-2">
            {t("userDashboard.settings.subscription")}
          </h3>
          <div className="flex justify-between items-start">
            {user?.isAdmin ? (
              <p className="text-sm text-gray-600 max-w-md p-2">
                {t("userDashboard.settings.administrator")}{" "}
                <i className="fas fa-badge-check text-blue-800 ml-2" />
              </p>
            ) : (
              <Fragment>
                <p className="text-sm text-gray-600 max-w-md p-2 pl-0">
                  {t("userDashboard.settings.subscriptionDesc")}{" "}
                  <p className="mt-3">
                    {t("userDashboard.settings.youHave")}
                    <CountdownTimer />
                  </p>
                </p>
                <Button
                  variant="default"
                  className="bg-black"
                  onClick={() => navigate("/upgrade")}
                >
                  {t("userDashboard.settings.learnMore")}
                </Button>
              </Fragment>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-sm text-red-600">
              {t("userDashboard.settings.deleteAccount")}
            </h3>
            <p className="text-sm text-gray-600 p-2">
              {t("userDashboard.settings.deleteDesc")}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            {t("userDashboard.settings.deleteAccount")}
          </Button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

AccountTab.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
};

export default AccountTab;
