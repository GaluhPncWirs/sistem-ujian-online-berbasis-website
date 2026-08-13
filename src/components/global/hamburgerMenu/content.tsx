import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";

export default function HamburgerMenu({ children }: React.PropsWithChildren) {
  const [isCheked, setIsCheked] = useState<boolean>(false);
  const clickOutsidePath = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutsideNavbar(event: MouseEvent) {
      if (
        clickOutsidePath.current &&
        !clickOutsidePath.current.contains(event.target as Node)
      ) {
        setIsCheked(false);
      }
    }

    window.addEventListener("click", handleClickOutsideNavbar);

    return () => {
      window.removeEventListener("click", handleClickOutsideNavbar);
    };
  }, []);

  return (
    <div className="md:hidden" ref={clickOutsidePath}>
      {/* Tombol Hamburger */}
      <div className="menu flex flex-col items-center gap-y-1 relative z-110">
        <Input
          type="checkbox"
          className="size-5 absolute cursor-pointer opacity-0 z-120"
          checked={isCheked}
          onChange={() => setIsCheked((prev) => !prev)}
        />
        <span className="block w-6 h-1 bg-slate-800 rounded-md transition-all"></span>
        <span className="block w-6 h-1 bg-slate-800 rounded-md transition-all"></span>
        <span className="block w-6 h-1 bg-slate-800 rounded-md transition-all"></span>
      </div>

      {/* Konten Menu */}
      <div
        className={`fixed inset-0 -top-5 left-0 w-full h-60 bg-slate-50 transition-all duration-300 font-semibold p-3 z-100
    ${isCheked ? `translate-y-0` : `-translate-y-full`}`}
      >
        {children}
      </div>
    </div>
  );
}
