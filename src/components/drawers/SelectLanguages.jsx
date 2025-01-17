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

export default function SelectLanguages() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center space-x-1 cursor-pointer">
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
              Make changes to the site language here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col mb-4">
            <Input id="lang" value="English" className="w-full mt-3 h-[45px]" />
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
