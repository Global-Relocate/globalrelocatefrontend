import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

export default function SelectLanguages() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://uk.usembassy.gov/wp-content/uploads/sites/16/US_Flag_Color_72DPI_750x450.jpg"
            className="w-7 h-7 rounded-full"
            alt="logo"
          />
          <span className="text-sm">EN</span>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-auto">
        <div className="mt-2"> {/* Added container div with margin-top */}
          <SheetHeader>
            <SheetTitle className="text-left">Select your language</SheetTitle>
            <SheetDescription className="text-left">
              Make changes to the site language here, click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col mb-4">
            <div className="relative w-full mt-3 h-[45px] flex items-center">
              <Input id="lang" value="English (US)" className="w-full h-full" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                className="w-full h-[40px] bg-[#FCA311] text-black hover:text-white mt-5"
              >
                Save Changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
