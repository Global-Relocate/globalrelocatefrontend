import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export default function ContactUs() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    // Here you would typically handle the form submission, e.g., send the data to an API
    alert(t("landingPage.contactUs.messageSent"));
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSending(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col justify-center items-center pt-[150px] pb-20 max-w-5xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center px-8 space-y-6">
          <div className="text-lg font-semibold text-black">
            {t("landingPage.contactUs.title")}
          </div>
          <h1 className="text-[45px] md:text-[56px] text-black font-bold text-center leading-[52px]">
            {t("landingPage.contactUs.titleDesc")}
          </h1>
          <p className="my-2 text-center text-[#030712] md:max-w-[480px]">
            {t("landingPage.contactUs.para")}
          </p>
        </div>

        <Separator className="!mt-20 mb-3 bg-[#E5E7EB]" />

        <div className="px-8 pt-4 md:px-0">
          <div className="flex flex-col flex-1">
            <div>
              <h1 className="text-black font-semibold text-lg">
                {t("landingPage.contactUs.dropUsAMessage")}
              </h1>
              <p className="text-[#4B5563] text-sm mt-2">
                {t("landingPage.contactUs.dropUsAMessageDesc")}
              </p>
            </div>

            <div className="w-full mt-6">
              <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-x-5">
                  <input
                    type="text"
                    placeholder={t("landingPage.contactUs.yourName")}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    placeholder={t("landingPage.contactUs.yourEmail")}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    onChange={handleChange}
                  />
                </div>

                <input
                  type="subject"
                  placeholder={t("landingPage.contactUs.subject")}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  onChange={handleChange}
                />

                <textarea
                  placeholder={t("landingPage.contactUs.yourMessage")}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[150px]"
                  required
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  className="bg-[#FCA311] hover:bg-[#e5940c] text-black rounded-lg text-sm transition-colors duration-20 py-2 px-4 w-fit"
                >
                  {isSending
                    ? t("landingPage.contactUs.sending")
                    : t("landingPage.contactUs.sendMessage")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
