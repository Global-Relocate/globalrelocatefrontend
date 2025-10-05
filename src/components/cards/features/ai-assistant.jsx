import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function AIAssistantCard() {
  const [hoveredImage, setHoveredImage] = useState(
    "/images/landing/ai-assistant-1.png"
  );
  const { t } = useTranslation();

  const items = [
    {
      title: t("landingPage.features.aiAssistant.item1.title"),
      icon: <i className="far fa-robot text-[#FCA311] text-2xl" />,
      para: t("landingPage.features.aiAssistant.item1.para"),
      image: "/images/landing/ai-assistant-1.png",
    },
    {
      title: t("landingPage.features.aiAssistant.item2.title"),
      icon: <i className="far fa-comment-alt-dots text-[#FCA311] text-2xl" />,
      para: t("landingPage.features.aiAssistant.item2.para"),
      image: "/images/landing/ai-assistant-2.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-x-24 gap-y-12 p-4 mt-12">
      {/* Left items */}
      <div className="relative min-h-[400px] flex items-center justify-center rounded-3xl overflow-hidden bg-[#feedcf] p-6 order-last md:order-first">
        <AnimatePresence mode="wait">
          <motion.img
            key={hoveredImage}
            src={hoveredImage}
            alt="Compare Preview"
            className="w-auto max-w-full h-auto rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* Right image preview */}
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold">
          {t("landingPage.features.aiAssistant.title")}
        </h3>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-x-4 cursor-pointer hover:shadow-md rounded-lg p-4 bg-white"
            onMouseEnter={() => setHoveredImage(item.image)}
            onMouseLeave={() =>
              setHoveredImage("/images/landing/ai-assistant-1.png")
            }
          >
            <span className="mt-1.5">{item.icon}</span>
            <div className="flex flex-col hover:text-[#FCA311]">
              <h2 className="font-medium text-lg sm:text-xl mb-1 transition">
                {item.title}
              </h2>
              <p className="text-[#626262] text-xs sm:text-sm">{item.para}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
