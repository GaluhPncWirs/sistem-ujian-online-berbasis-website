"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import CompAlurUjian from "@/components/local/beranda/alurUjian/content";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import {
  ArrowRight,
  Award,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  LogIn,
  MousePointerClick,
  PencilLine,
  Route,
  Shapes,
  ShieldCheck,
} from "lucide-react";
import Homepage from "@/layout/homepage/content";
import FiturUnggulan from "@/components/local/beranda/fiturUnggulan/content";

export default function Introduction() {
  const getidUsers = useGetIdUsers((state) => state.role);
  const [isSizeMobile, setIsSizeMobile] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    function handler(e: MediaQueryListEvent | MediaQueryList) {
      setIsSizeMobile(e.matches);
    }

    handler(mediaQuery);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <Homepage>
      <header className="relative flex items-center overflow-hidden pt-10">
        {/* Background Image */}
        <Image
          src="/img/beranda/heroSectionUjian.jpg"
          alt="Platform ujian online"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/30" />

        {/* Soft Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
            <div className="max-w-2xl">
              {/* Small Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                Platform Ujian Online
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Ujian Online
                <span className="block text-blue-600">
                  Mudah, Cepat & Fleksibel
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Ikuti ujian kapan saja dan di mana saja dengan sistem ujian
                online yang praktis, mudah digunakan, dan dirancang untuk
                memberikan pengalaman belajar yang lebih nyaman.
              </p>

              {/* CTA */}
              <div className="mt-8 flex gap-4 items-center">
                <Link
                  href={
                    getidUsers.includes("pelajar")
                      ? "/Student/Dashboard"
                      : getidUsers.includes("pengajar")
                        ? "/Teacher/dashboard"
                        : "/Auth/Login"
                  }
                  className="group inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Mulai Ujian
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="#content"
                  className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:text-blue-600"
                >
                  Pelajari lebih lanjut
                  <ChevronDown className="size-5 animate-bounce" />
                </Link>
              </div>

              {/* Small Trust Info */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-600" />
                  Mudah digunakan
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-600" />
                  Bisa diakses kapan saja
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-600" />
                  Proses cepat
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        id="content"
        className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white"
      >
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
          {/* Section Heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
              Fitur Unggulan
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Nikmati pengalaman ujian online yang lebih mudah, cepat, aman, dan
              nyaman dengan berbagai fitur yang kami sediakan.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FiturUnggulan
              Icon={MousePointerClick}
              titleFeature="Mudah Diakses"
              descFeature="Ujian dapat diikuti kapan saja dan di mana saja selama terhubung dengan internet."
            />

            <FiturUnggulan
              Icon={CircleCheck}
              titleFeature="Hasil Langsung"
              descFeature="Nilai ujian dapat langsung diketahui setelah peserta menyelesaikan ujian."
            />

            <FiturUnggulan
              Icon={Shapes}
              titleFeature="Soal Beragam"
              descFeature="Mendukung berbagai jenis soal seperti pilihan ganda dan essay."
            />

            <FiturUnggulan
              Icon={ShieldCheck}
              titleFeature="Keamanan Terjamin"
              descFeature="Data peserta dan hasil ujian dijaga dengan sistem yang aman dan terpercaya."
            />
          </div>
        </div>
      </section>

      <section className="bg-blue-100 pt-14 sm:pt-20 lg:pt-32">
        <div className="mx-auto py-16 w-10/12">
          <h1 className="text-4xl font-bold mb-5 text-[#0F4C75] tracking-wide">
            Tampilan Sistem
          </h1>
          <div>
            <h2 className="text-xl font-semibold text-justify tracking-wide">
              Antarmuka yang bersih memudahkan peserta untuk mengerjakan soal
            </h2>
            <Carousel
              opts={{
                align: "start",
              }}
              orientation={isSizeMobile ? "vertical" : "horizontal"}
              className="mt-20 sm:mt-10"
            >
              <CarouselContent className="max-h-60 sm:max-h-56 md:max-h-72 lg:max-h-96">
                <CarouselItem className="flex items-center justify-center p-5">
                  <Image
                    src="/img/beranda/dashboardSiswa.jpeg"
                    alt="Dashboard Page"
                    width={500}
                    height={500}
                    className="shadow-lg shadow-slate-700 w-full sm:w-2/3 rounded-md"
                  />
                </CarouselItem>
                <CarouselItem className="flex items-center justify-center p-5">
                  <Image
                    src="/img/beranda/profileSiswa.jpeg"
                    alt="Profile Page"
                    width={500}
                    height={500}
                    className="shadow-lg shadow-slate-700 w-full sm:w-3/4 rounded-md"
                  />
                </CarouselItem>
                <CarouselItem className="flex items-center justify-center p-5">
                  <Image
                    src="/img/beranda/ujian.jpeg"
                    alt="Ujian Page"
                    width={500}
                    height={500}
                    className="shadow-lg shadow-slate-700 w-full sm:w-3/4 rounded-md"
                  />
                </CarouselItem>
                <CarouselItem className="flex items-center justify-center p-5">
                  <Image
                    src="/img/beranda/riwayatUjian.jpeg"
                    alt="Riwayat Ujian Page"
                    width={500}
                    height={500}
                    className="shadow-lg shadow-slate-700 w-full sm:w-3/4 rounded-md"
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 bg-linear-to-t from-slate-100 pt-32 sm:pt-40 md:pt-52">
        <div className="mx-auto w-10/12 lg:w-2/3">
          <div className="flex items-center gap-x-5 mb-5">
            <Route className="size-10" />
            <h1 className="text-4xl font-bold text-[#0F4C75] tracking-wide">
              Alur Ujian
            </h1>
          </div>
          <CompAlurUjian>
            <div className="flex gap-3 items-center">
              <h1 className="font-bold text-2xl tracking-wide">
                Daftar / Login
              </h1>
              <LogIn className="size-8" />
            </div>
            <h2 className="font-semibold mt-3 text-justify text-[#393E46] text-lg sm:text-xl">
              Buat akun baru atau masuk dengan akun yang sudah ada untuk
              mengakses sistem ujian online
            </h2>
          </CompAlurUjian>
          <CompAlurUjian>
            <div className="flex gap-3 items-center">
              <h1 className="font-bold text-2xl tracking-wide">Pilih Ujian</h1>
              <MousePointerClick className="size-8" />
            </div>
            <h2 className="font-semibold mt-3 text-justify text-[#393E46] text-lg sm:text-xl">
              Telusuri dan pilih ujian yang tersedia sesuai jadwal yang ingin
              Anda ikuti
            </h2>
          </CompAlurUjian>
          <CompAlurUjian>
            <div className="flex gap-3 items-center">
              <h1 className="font-bold text-2xl tracking-wide">
                Kerjakan Ujiannya
              </h1>
              <PencilLine className="size-8" />
            </div>
            <h2 className="font-semibold mt-3 text-justify text-[#393E46] text-lg sm:text-xl">
              Kerjakan soal secara online melalui antarmuka yang sederhana,
              didukung dengan navigasi soal
            </h2>
          </CompAlurUjian>
          <CompAlurUjian>
            <div className="flex gap-3 items-center">
              <h1 className="font-bold text-2xl tracking-wide">Lihat Nilai</h1>
              <Award className="size-8" />
            </div>
            <h2 className="font-semibold mt-3 text-justify text-[#393E46] text-lg sm:text-xl">
              Setelah selesai, langsung dapatkan hasil ujian dan nilai anda
            </h2>
          </CompAlurUjian>
        </div>
      </div>
    </Homepage>
  );
}
