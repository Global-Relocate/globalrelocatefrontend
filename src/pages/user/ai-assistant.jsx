import AiChatInput from "@/components/forms/AiChatInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import React from "react";
import { BiEdit, BiPlus } from "react-icons/bi";
import { PiShare } from "react-icons/pi";
import { TbDots } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdDelete } from "react-icons/md";

function AiAssistant() {
  return (
    <DashboardLayout>
      <AiChatInput />
      <div className="flex w-full items-center justify-between">
        <Button className="text-3xl rounded-2xl" size="icon">
          <BiPlus />
        </Button>
        <div className="flex gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="rounded-2xl bg-[#F6F6F6] text-black hover:text-white"
              >
                <TbDots />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Rename
                  <DropdownMenuShortcut>
                    <BiEdit />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  Delete Conversation
                  <DropdownMenuShortcut>
                    <MdDelete />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="rounded-2xl bg-[#F6F6F6] text-black hover:text-white">
            <PiShare /> Share
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-col items-center h-[70vh]">
        <h2 className="text-3xl mt-52">Hello, Friend.</h2>
      </div>
    </DashboardLayout>
  );
}

export default AiAssistant;
