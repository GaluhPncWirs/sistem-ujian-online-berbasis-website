import Homepage from "@/layout/homepage/content";
import { ArrowRight, Cog, FileWarning, Lightbulb, Signal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const howToUseSteps = [
  {
    step: "01",
    title: "Login ke Akun Anda",
    description:
      "Masukkan email dan password Anda pada halaman login untuk mengakses sistem ujian.",
    image: "/img/howToUse/login_tutor.png",
    alt: "Login ke akun",
  },
  {
    step: "02",
    title: "Pilih Ujian yang Tersedia",
    description:
      "Buka dashboard kemudian pilih ujian yang ingin Anda ikuti sesuai jadwal yang tersedia.",
    image: "/img/howToUse/chooseExam_tutor.png",
    alt: "Pilih ujian",
  },
  {
    step: "03",
    title: "Baca Instruksi Ujian",
    description:
      "Pastikan Anda memahami aturan, jumlah soal, dan durasi sebelum memulai ujian.",
    image: "/img/howToUse/readInstructions_tutor.png",
    alt: "Instruksi ujian",
  },
  {
    step: "04",
    title: "Kerjakan Soal",
    description:
      "Jawab seluruh soal dengan teliti dan manfaatkan waktu yang tersedia sebaik mungkin.",
    image: "/img/howToUse/do_itExams_tutor.png",
    alt: "Mengerjakan ujian",
  },
  {
    step: "05",
    title: "Kumpulkan Jawaban",
    description:
      'Setelah selesai memeriksa jawaban, klik tombol "Submit" untuk mengakhiri ujian.',
    image: "/img/howToUse/submitExam_tutor.png",
    alt: "Mengumpulkan jawaban",
  },
];

export default function CaraPakaiSistemUjian() {
  return (
    <Homepage>
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 rounded-full bg-sky-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
          {/* Heading */}
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600">
              Panduan Penggunaan
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Cara Menggunakan Sistem Ujian Online
            </h1>

            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Ikuti beberapa langkah sederhana berikut untuk memulai dan
              menyelesaikan ujian online dengan lancar.
            </p>
          </div>

          {/* Steps */}
          <div className="mx-auto mt-14 max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              {howToUseSteps.map((item, index) => (
                <div
                  key={item.step}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 ${
                    index === howToUseSteps.length - 1
                      ? "md:col-span-2 md:mx-auto md:w-1/2"
                      : ""
                  }`}
                >
                  {/* Step Number */}
                  <div className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    {item.step}
                  </div>

                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    {/* Illustration */}
                    <div className="flex shrink-0 items-center justify-center rounded-2xl bg-blue-50 p-5 transition-colors duration-300 group-hover:bg-blue-100">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={500}
                        height={500}
                        className="size-24 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="pr-8">
                      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Langkah {item.step}
                      </p>

                      <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                        {item.title}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="mt-6 h-1 w-10 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mx-auto mt-10 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white shadow-sm">
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
                    <Lightbulb className="size-6 text-amber-500" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Tips Sebelum Mengikuti Ujian
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Perhatikan beberapa hal berikut untuk menghindari kendala
                      saat mengerjakan ujian.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {/* Tip 1 */}
                  <div className="rounded-xl border border-amber-100 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
                        <Signal className="size-5 text-green-500" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Jaringan Stabil
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          Pastikan koneksi internet stabil sebelum memulai
                          ujian.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tip 2 */}
                  <div className="rounded-xl border border-amber-100 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
                        <Cog className="size-5 text-green-500" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Penyimpanan Otomatis
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          Jawaban akan tersimpan secara otomatis saat waktu
                          ujian berakhir.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tip 3 */}
                  <div className="rounded-xl border border-amber-100 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                        <FileWarning className="size-5 text-red-500" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Jangan Tutup Browser
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          Hindari menutup tab atau browser sebelum ujian
                          selesai.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Sudah memahami langkah-langkahnya?
            </p>

            <Link
              href="/Auth/Login"
              className="mt-4 inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
            >
              Mulai Ujian
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </div>
        </div>
      </section>
    </Homepage>
  );
}
