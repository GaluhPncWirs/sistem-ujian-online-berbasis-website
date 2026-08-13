"use client";
import Image from "next/image";
import HamburgerMenu from "../hamburgerMenu/content";
import ButtonAutentications from "./buttonAuth/content";
import ListContent from "./listContent/content";
import Link from "next/link";

export default function NavigasiBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-10">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="shrink-0">
            <Image
              src="/img/global/logo.png"
              alt="ExamOnline"
              width={500}
              height={500}
              className="w-44 object-contain sm:w-48"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-1">
            <ListContent />
          </nav>

          {/* Authentication */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
            <ButtonAutentications />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <HamburgerMenu>
            <div className="mt-7 flex flex-col gap-6 px-5">
              <div className="flex flex-col gap-2">
                <ListContent />
              </div>

              <div className="border-t border-slate-200 pt-5 space-x-4">
                <ButtonAutentications />
              </div>
            </div>
          </HamburgerMenu>
        </div>
      </div>
    </header>
  );
}
