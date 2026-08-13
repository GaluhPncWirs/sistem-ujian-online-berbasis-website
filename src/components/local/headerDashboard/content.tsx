import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import HamburgerMenu from "@/components/global/hamburgerMenu/content";
import ListSidebar from "@/components/global/listSidebar/content";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PropsHeaderDashboard = {
  remainder: any[];
  isLocationPage: string;
};

export default function HeaderDashboard({
  remainder,
  isLocationPage,
}: PropsHeaderDashboard) {
  return (
    <div className="flex items-center justify-end gap-x-3 absolute right-0">
      {remainder.length > 0 ? (
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative flex justify-end">
              <div className="size-4 bg-red-400 absolute rounded-md flex justify-center items-center">
                <span className="text-xs font-bold">{remainder.length}</span>
              </div>
              <Bell className="size-6" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-3">
            <h1 className="font-semibold text-xs">
              Ada {remainder.length} Ujian Yang Belum{" "}
              {isLocationPage === "/Student/Dashboard"
                ? "Dikerjakan"
                : "Dinilai"}
            </h1>
          </PopoverContent>
        </Popover>
      ) : (
        <Bell className="size-6" />
      )}
      <HamburgerMenu>
        <ListSidebar />
      </HamburgerMenu>
    </div>
  );
}
