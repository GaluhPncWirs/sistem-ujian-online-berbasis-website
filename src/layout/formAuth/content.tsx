"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type PropsFormAccount = {
  formTitle: string;
  children: React.ReactNode;
};

export default function FormAuth(props: PropsFormAccount) {
  const { formTitle, children } = props;
  const pathName = usePathname();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 py-10 lg:px-10">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-2">
          {/* Left - Branding */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            {/* Decorative Shape */}
            <div className="absolute -right-24 -top-24 size-72 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-white/10" />

            <div className="relative z-10">
              <Link href="/Introduction" className="inline-flex items-center">
                <Image
                  src="/img/global/logo.png"
                  alt="ExamOnline"
                  width={500}
                  height={500}
                  className="w-56 object-contain brightness-0 invert"
                  priority
                />
              </Link>

              <div className="mt-14 max-w-md">
                <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                  Platform Ujian Online
                </span>

                <h1 className="mt-5 text-4xl font-extrabold leading-tight xl:text-5xl">
                  Ujian lebih mudah,
                  <span className="block text-blue-100">
                    kapan saja dan di mana saja.
                  </span>
                </h1>

                <p className="mt-6 text-base leading-7 text-blue-50 xl:text-lg">
                  Kelola dan ikuti ujian secara online dengan proses yang
                  sederhana, cepat, dan nyaman.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 text-sm text-blue-50">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/15">
                <ShieldCheck className="size-5" />
              </div>
              <span>Data akun dan aktivitas ujian dijaga dengan aman.</span>
            </div>
          </div>

          {/* Right - Login */}
          <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
            <div className="w-full max-w-md">
              {/* Back */}
              <Link
                href="/Introduction"
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
              >
                <ArrowLeft className="size-4" />
                Kembali ke Beranda
              </Link>

              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {formTitle}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Masuk untuk melanjutkan ke sistem ujian online.
                </p>
              </div>

              {children}

              {/* Register */}
              <div className="mt-7 text-center text-sm text-slate-500">
                {pathName === "/Auth/Login" ? (
                  <>
                    Belum punya akun?{" "}
                    <Link
                      href="/Auth/Daftar"
                      className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                    >
                      Daftar sekarang
                    </Link>
                  </>
                ) : (
                  <>
                    Sudah punya akun?{" "}
                    <Link
                      href="/Auth/Login"
                      className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
