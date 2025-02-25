import MainLayout from "@/components/layouts/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqList } from "@/fake-data-store";

const HelpCenter = () => {
  return (
    <MainLayout>
      <div className="flex items-center flex-col">
        <div className="w-full h-[250px] md:h-[480px] bg-[#FCA311] flex items-center justify-center">
          <h1 className="text-4xl md:text-7xl/[80px] mt-10 text-center font-semibold max-w-[80%] md:max-w-[430px]">
            We are here to help.
          </h1>
        </div>
        <div className="max-w-[90%]  md:max-w-[1000px] w-full flex flex-col  py-10">
          <h2 className="text-2xl font-medium">How can we help you?</h2>
          <p className="text-md mt-1">
            Check out our FAqs or <span>Contact Us</span> for more support.
          </p>

          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4 mt-10"
          >
            {faqList.map((item, idx) => {
              return (
                <AccordionItem
                  className="border rounded-lg px-3"
                  value={`item-${idx + 1}`}
                >
                  <AccordionTrigger className="">{item.title}</AccordionTrigger>
                  <AccordionContent>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsum nisi non totam perferendis accusantium itaque nam
                    blanditiis expedita minus. Sunt quas, veritatis pariatur
                    doloremque aperiam voluptates incidunt molestiae?
                    Aspernatur, incidunt.
                  </AccordionContent>
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
