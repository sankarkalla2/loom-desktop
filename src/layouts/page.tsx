import { useState } from "react";
import { Button } from "../components/ui/button";
import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X } from "lucide-react";
import { DashboardIcon } from "@radix-ui/react-icons";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ControlLayout = ({ children, className }: Props) => {
  const [invisible, setIsInvisible] = useState(false);

  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    console.log(event);
    setIsInvisible(payload.state);
  });
  return (
    <div className="">
      <div
        className={cn(
          className,
          invisible && "invisible",
          "bg-[#171717] flex-col p-5 overflow-hidden"
        )}
      >
        {children}
        <div className="flex justify-between items-center cursor-pointer draggble">
          <span>
            <UserButton />
          </span>
          <X
            size={20}
            className="text-gray-400 non-draggble hover:text-white cursor-pointer"
            onClick={onCloseApp}
          />
        </div>
        <div className="overflow-auto flex-1">
          <div className="p-5 flex w-full">
            <div className="flex items-center gap-x-2">
              <DashboardIcon className="text-white" />
              <p className="text-white">Loom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlLayout;
