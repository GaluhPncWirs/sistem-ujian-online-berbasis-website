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
import CompFiturUnggulan from "@/components/local/beranda/fiturUnggulan/content";
import CompAlurUjian from "@/components/local/beranda/alurUjian/content";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  LogIn,
  MousePointerClick,
  PencilLine,
  Route,
} from "lucide-react";
import Homepage from "@/layout/homepage/content";

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

      <section className="bg-slate-50 bg-linear-to-b from-slate-100">
        <div className="mx-auto w-10/12 py-14" id="content">
          <h1 className="text-4xl font-bold mb-12 text-[#0F4C75] tracking-wide">
            Fitur Unggulan
          </h1>
          <div className="grid gap-10 place-content-center place-items-center grid-cols-1 md:grid-cols-2">
            <CompFiturUnggulan
              imgSrc="/img/beranda/mudah.png"
              imgAlt="Mudah"
              titleFeature="Mudah Diakses"
              descFeature="Ujian dapat diikuti dimanapun Anda Berada"
            />

            <CompFiturUnggulan
              imgSrc="/img/beranda/hasil.png"
              imgAlt="Mudah"
              titleFeature="Hasil Langsung"
              descFeature="Nilai langsung keluar setelah selesai ujian."
            />

            <CompFiturUnggulan
              imgSrc="/img/beranda/variation.png"
              imgAlt="Mudah"
              titleFeature="Soal Beragam"
              descFeature="Mendukung soal pilihan ganda dan essay."
            />
            <CompFiturUnggulan
              imgSrc="/img/beranda/keamanan.png"
              imgAlt="keamanan"
              titleFeature="Keamanan Terjamin"
              descFeature="Data peserta dan hasil ujian terjamin aman."
            />
          </div>
        </div>
      </section>

      <div className="bg-blue-100 pt-14 sm:pt-20 lg:pt-32">
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
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="absolute"
      >
        <path
          fill="#dbeafe"
          fillOpacity="1"
          d="M0,192L30,170.7C60,149,120,107,180,101.3C240,96,300,128,360,144C420,160,480,160,540,138.7C600,117,660,75,720,96C780,117,840,203,900,229.3C960,256,1020,224,1080,176C1140,128,1200,64,1260,42.7C1320,21,1380,43,1410,53.3L1440,64L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
        ></path>
      </svg>

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
