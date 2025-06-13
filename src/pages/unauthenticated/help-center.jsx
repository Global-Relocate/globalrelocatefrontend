import MainLayout from "@/components/layouts/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const HelpCenter = () => {
  const { t } = useTranslation();

  const faqList = [
    {
      title: t("landingPage.helpCenter.faqs.question1.question"),
      content: t("landingPage.helpCenter.faqs.question1.answer"),
    },
    {
      title: t("landingPage.helpCenter.faqs.question2.question"),
      content: t("landingPage.helpCenter.faqs.question2.answer"),
    },
    {
      title: t("landingPage.helpCenter.faqs.question3.question"),
      content: t("landingPage.helpCenter.faqs.question3.answer"),
    },
    {
      title: t("landingPage.helpCenter.faqs.question4.question"),
      content: t("landingPage.helpCenter.faqs.question4.answer"),
    },
    {
      title: t("landingPage.helpCenter.faqs.question5.question"),
      content: t("landingPage.helpCenter.faqs.question5.answer"),
    },
    {
      title: t("landingPage.helpCenter.faqs.question6.question"),
      content: t("landingPage.helpCenter.faqs.question6.answer"),
    },
    {
      title: t("landingPage.helpCenter.faqs.question7.question"),
      content: t("landingPage.helpCenter.faqs.question7.answer"),
    },
  ];

  return (
    <MainLayout>
      <div className="flex items-center flex-col">
        <div className="w-full h-[250px] md:h-[480px] bg-white flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl/[80px] mt-10 text-center font-semibold max-w-[80%] md:max-w-[430px]">
            {t("landingPage.helpCenter.help")}
          </h1>
        </div>
        <div className="max-w-[90%]  md:max-w-[1000px] w-full flex flex-col  py-10">
          <h2 className="text-2xl font-medium">
            {t("landingPage.helpCenter.howCanWeHelp")}
          </h2>
          <p className="text-md mt-1">{t("landingPage.helpCenter.checkOut")}</p>

          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4 mt-10"
          >
            {faqList.map((item, idx) => {
              return (
                <AccordionItem
                  key={idx}
                  className="border rounded-lg px-3"
                  value={`item-${idx + 1}`}
                >
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpCenter;
