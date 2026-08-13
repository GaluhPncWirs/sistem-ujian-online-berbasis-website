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
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  LogIn,
  MousePointerClick,
  PencilLine,
  Shapes,
  ShieldCheck,
} from "lucide-react";
import Homepage from "@/layout/homepage/content";
import FiturUnggulan from "@/components/local/beranda/fiturUnggulan/content";
import AlurUjian from "@/components/local/beranda/alurUjian/content";

export default function Introduction() {
  const getidUsers = useGetIdUsers((state) => state.role);

  return (
    <Homepage>
      <header className="relative flex items-center overflow-hidden">
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
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
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

      <section
        id="system-preview"
        className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-slate-50 to-white"
      >
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -left-40 top-20 size-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-20 size-96 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Tampilan Sistem
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
              Antarmuka yang bersih dan sederhana membantu peserta mengerjakan
              ujian dengan lebih fokus dan nyaman.
            </p>
          </div>

          {/* Carousel */}
          <div className="mx-auto mt-12 max-w-5xl sm:mt-16">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {/* Dashboard */}
                <CarouselItem className="basis-full">
                  <div className="px-2 sm:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
                      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <span className="size-2.5 rounded-full bg-red-400" />
                        <span className="size-2.5 rounded-full bg-yellow-400" />
                        <span className="size-2.5 rounded-full bg-green-400" />

                        <span className="ml-3 text-sm font-medium text-slate-500">
                          Dashboard Siswa
                        </span>
                      </div>

                      <div className="relative aspect-video w-full bg-slate-100">
                        <Image
                          src="/img/beranda/dashboardSiswa.jpeg"
                          alt="Dashboard siswa"
                          fill
                          sizes="(max-width: 768px) 100vw, 1024px"
                          className="object-cover object-top"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-lg font-bold text-slate-900">
                        Dashboard Siswa
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Ringkasan aktivitas dan informasi ujian peserta.
                      </p>
                    </div>
                  </div>
                </CarouselItem>

                {/* Profile */}
                <CarouselItem className="basis-full">
                  <div className="px-2 sm:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
                      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                        <span className="ml-3 text-sm font-medium text-slate-500">
                          Profile Siswa
                        </span>
                      </div>

                      <div className="relative aspect-video w-full bg-slate-100">
                        <Image
                          src="/img/beranda/profileSiswa.jpeg"
                          alt="Profile siswa"
                          fill
                          sizes="(max-width: 768px) 100vw, 1024px"
                          className="object-cover object-top"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-lg font-bold text-slate-900">
                        Profile Siswa
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Kelola informasi profil peserta dengan mudah.
                      </p>
                    </div>
                  </div>
                </CarouselItem>

                {/* Exam */}
                <CarouselItem className="basis-full">
                  <div className="px-2 sm:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
                      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                        <span className="ml-3 text-sm font-medium text-slate-500">
                          Halaman Ujian
                        </span>
                      </div>

                      <div className="relative aspect-video w-full bg-slate-100">
                        <Image
                          src="/img/beranda/ujian.jpeg"
                          alt="Halaman ujian"
                          fill
                          sizes="(max-width: 768px) 100vw, 1024px"
                          className="object-cover object-top"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-lg font-bold text-slate-900">
                        Halaman Ujian
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Kerjakan soal dengan tampilan yang fokus dan sederhana.
                      </p>
                    </div>
                  </div>
                </CarouselItem>

                {/* History */}
                <CarouselItem className="basis-full">
                  <div className="px-2 sm:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
                      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <span className="size-2.5 rounded-full bg-red-400" />
                        <span className="size-2.5 rounded-full bg-yellow-400" />
                        <span className="size-2.5 rounded-full bg-green-400" />

                        <span className="ml-3 text-sm font-medium text-slate-500">
                          Riwayat Ujian
                        </span>
                      </div>

                      <div className="relative aspect-video w-full bg-slate-100">
                        <Image
                          src="/img/beranda/riwayatUjian.jpeg"
                          alt="Riwayat ujian"
                          fill
                          sizes="(max-width: 768px) 100vw, 1024px"
                          className="object-cover object-top"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-lg font-bold text-slate-900">
                        Riwayat Ujian
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Lihat kembali hasil dan riwayat ujian yang telah
                        dikerjakan.
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>

              {/* Navigation */}
              <CarouselPrevious className="left-0 hidden sm:flex" />
              <CarouselNext className="right-0 hidden sm:flex" />
            </Carousel>

            {/* Mobile Navigation Hint */}
            <div className="mt-8 flex justify-center text-sm text-slate-400 sm:hidden">
              Geser untuk melihat tampilan lainnya
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-t from-white via-slate-50 to-slate-100">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Alur Ujian
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
              Ikuti beberapa langkah sederhana untuk memulai, mengerjakan,
              hingga mendapatkan hasil ujian Anda.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-blue-200 sm:left-1/2 sm:-translate-x-1/2" />

            <div className="space-y-10 sm:space-y-12">
              <AlurUjian
                step="01"
                title="Daftar / Login"
                description="Buat akun baru atau masuk dengan akun yang sudah ada untuk mengakses sistem ujian online."
                Icon={LogIn}
              />

              <AlurUjian
                step="02"
                title="Pilih Ujian"
                description="Telusuri dan pilih ujian yang tersedia sesuai jadwal yang ingin Anda ikuti."
                Icon={MousePointerClick}
                reverse
              />

              <AlurUjian
                step="03"
                title="Kerjakan Ujian"
                description="Kerjakan soal secara online melalui antarmuka yang sederhana dengan navigasi soal yang mudah digunakan."
                Icon={PencilLine}
              />

              <AlurUjian
                step="04"
                title="Lihat Nilai"
                description="Setelah selesai, langsung dapatkan hasil ujian dan nilai Anda."
                Icon={Award}
                reverse
              />
            </div>
          </div>
        </div>
      </section>
    </Homepage>
  );
}
