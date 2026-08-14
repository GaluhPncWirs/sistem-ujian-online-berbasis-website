"use client";
import CreateNewQuestions from "@/components/local/khususGuru/buatSoal/createQuestions";
import ViewQuestions from "@/components/local/khususGuru/hasilPertanyaan/pertanyaan";
import ManageStudent from "@/components/local/khususGuru/kelolaSiswa/manageStudent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";
import HeaderDasboard from "@/components/local/forDasboard/content";
import FloatingBarDashboardTeacher from "@/components/local/khususGuru/navigasi/floatingBar";
import { getResultExamDataStudent } from "@/app/hooks/getDataResultStudent";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { useGetDataUsers } from "@/store/useGetDataUsers/state";
import MainContent from "@/layout/mainContent/content";
import { BarChart3, ClipboardCheck, Layers } from "lucide-react";
import { useManageDataExams } from "@/app/hooks/getManageDataExams";
import ListJadwalUjian from "@/components/local/khususGuru/listJadwalUjian/content";

export default function Teacher() {
  const [dashboardButton, setDashboardButton] = useState({
    scheduleExams: true,
    createQuestions: false,
    viewResult: false,
    manageStudent: false,
  });
  const getidTeacher = useGetIdUsers((state) => state.idUser);
  const dataUserTeacher = useGetDataUsers((state) => state.dataUsers);
  const manageDataExams = useManageDataExams(getidTeacher);
  const dataStudentExams = getResultExamDataStudent(getidTeacher);

  function handleClickItem(event: string) {
    setDashboardButton({
      scheduleExams: event === "scheduleExams",
      createQuestions: event === "createQuestions",
      viewResult: event === "viewResult",
      manageStudent: event === "manageStudent",
    });
  }

  const jumlahSiswa = new Set(
    manageDataExams.flatMap((a: any) => a.lengthStudent),
  );

  const averageValueExam = manageDataExams
    ?.flatMap((item: any) => item.hasil_ujian)
    .filter((a: string) => a !== "pending" && a !== "telat")
    .map(Number)
    .reduce((acc: number, cur: number) => acc + cur, 0);

  return (
    <MainContent>
      {manageDataExams.length > 0 ? (
        <div>
          <HeaderDasboard
            user="Pengajar"
            fullName={dataUserTeacher?.fullName ?? ""}
            exams={dataStudentExams}
          />
          <div className="space-y-8">
            {/* ================= SUMMARY ================= */}
            <section>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Teacher Overview
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Ringkasan Aktivitas Ujian
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Pantau ujian, jumlah siswa, dan perkembangan nilai dari
                  dashboard Anda.
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Ujian Dibuat */}
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Ujian Dibuat
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-slate-900">
                        {manageDataExams.length || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Total ujian yang dikelola
                      </p>
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <ClipboardCheck className="size-6" strokeWidth={1.8} />
                    </div>
                  </div>
                </div>

                {/* Jumlah Siswa */}
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Jumlah Siswa
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-slate-900">
                        {jumlahSiswa.size || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Siswa yang terdaftar pada ujian
                      </p>
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                      <Layers className="size-6" strokeWidth={1.8} />
                    </div>
                  </div>
                </div>

                {/* Nilai Rata-rata */}
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Nilai Rata-Rata
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-slate-900">
                        {Math.round(averageValueExam / jumlahSiswa.size) || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Rata-rata hasil ujian siswa
                      </p>
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <BarChart3 className="size-6" strokeWidth={1.8} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= QUICK ACTION ================= */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Kelola Ujian
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Akses fitur pengelolaan ujian dan siswa dengan cepat.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <FloatingBarDashboardTeacher
                  handleClickItem={handleClickItem}
                  activeItem={
                    dashboardButton.scheduleExams
                      ? "scheduleExams"
                      : dashboardButton.createQuestions
                        ? "createQuestions"
                        : dashboardButton.viewResult
                          ? "viewResult"
                          : "manageStudent"
                  }
                />
              </div>
            </section>

            {/* ================= CONTENT ================= */}
            <section>
              {dashboardButton.scheduleExams === true ? (
                <ListJadwalUjian manageDataExams={manageDataExams} />
              ) : dashboardButton.createQuestions === true ? (
                <CreateNewQuestions />
              ) : dashboardButton.viewResult === true ? (
                <ViewQuestions />
              ) : dashboardButton.manageStudent === true ? (
                <ManageStudent />
              ) : null}
            </section>
          </div>
        </div>
      ) : (
        <>
          {/* ================= SUMMARY ================= */}
          <section>
            {/* Heading */}
            <div className="animate-pulse">
              <div className="h-3 w-32 rounded bg-slate-200" />

              <div className="mt-2 h-7 w-64 rounded-md bg-slate-200" />

              <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-100" />
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between animate-pulse">
                    <div className="w-full">
                      <div className="h-4 w-32 rounded bg-slate-200" />

                      <div className="mt-3 h-9 w-16 rounded-md bg-slate-200" />

                      <div className="mt-2 h-3 w-44 rounded bg-slate-100" />
                    </div>

                    <div className="size-12 shrink-0 rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= QUICK ACTION ================= */}
          <section>
            <div className="mb-4 animate-pulse">
              <div className="h-6 w-36 rounded-md bg-slate-200" />
              <div className="mt-2 h-3 w-72 max-w-full rounded bg-slate-100" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-pulse">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-16 rounded-xl bg-slate-100" />
                ))}
              </div>
            </div>
          </section>

          {/* ================= SCHEDULE ================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="animate-pulse">
                <div className="h-3 w-24 rounded bg-slate-200" />

                <div className="mt-2 h-6 w-52 rounded-md bg-slate-200" />

                <div className="mt-2 h-3 w-72 max-w-full rounded bg-slate-100" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[720px] animate-pulse">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_2fr_1fr_1.5fr_1fr] gap-4 bg-slate-50 px-5 py-4">
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                </div>

                {/* Rows */}
                {[1, 2, 3, 4, 5].map((row) => (
                  <div
                    key={row}
                    className="grid grid-cols-[60px_2fr_1fr_1.5fr_1fr] gap-4 border-t border-slate-100 px-5 py-5"
                  >
                    <div className="h-4 w-6 rounded bg-slate-100" />

                    <div className="h-4 w-44 rounded bg-slate-100" />

                    <div className="h-4 w-20 rounded bg-slate-100" />

                    <div className="h-4 w-32 rounded bg-slate-100" />

                    <div className="h-6 w-24 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </MainContent>
  );
}
