"use client";
import CreateNewQuestions from "@/components/local/khususGuru/buatSoal/createQuestions";
import ViewQuestions from "@/components/local/khususGuru/hasilPertanyaan/pertanyaan";
import ManageStudent from "@/components/local/khususGuru/kelolaSiswa/manageStudent";
import { useState } from "react";
import HeaderDasboard from "@/components/local/forDasboard/content";
import FloatingBarDashboardTeacher from "@/components/local/khususGuru/navigasi/floatingBar";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { useGetDataUsers } from "@/store/useGetDataUsers/state";
import MainContent from "@/layout/mainContent/content";
import { BarChart3, ClipboardCheck, Layers } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useManageDataExams } from "@/app/hooks/getManageDataExams";
import { useResultExamDataStudent } from "@/app/hooks/getDataResultStudent";
import PaginationUi from "@/components/global/pagination/content";
import { useGetStatistics } from "@/app/hooks/getManageExamStatistik";

export default function Teacher() {
  const [dashboardButton, setDashboardButton] = useState({
    scheduleExams: true,
    createQuestions: false,
    viewResult: false,
    manageStudent: false,
  });

  function handleClickItem(event: string) {
    setDashboardButton({
      scheduleExams: event === "scheduleExams",
      createQuestions: event === "createQuestions",
      viewResult: event === "viewResult",
      manageStudent: event === "manageStudent",
    });
  }
  const getidTeacher = useGetIdUsers((state) => state.idUser);
  const dataUserTeacher = useGetDataUsers((state) => state.dataUsers);
  const dataStudentExams = useResultExamDataStudent(getidTeacher);
  const { averageValueExam, jumlahSiswa } = useGetStatistics(getidTeacher);

  // pagination
  const [page, setPage] = useState(1);
  const { dataManageExams, totalData, isLoading, pageSize } =
    useManageDataExams(getidTeacher, page);
  const totalPages = Math.ceil(totalData / pageSize);

  return (
    <MainContent>
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
                      {dataManageExams.length || 0}
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
                      {jumlahSiswa || 0}
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
                      {Math.round(averageValueExam / jumlahSiswa) || 0}
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
              <h2 className="text-xl font-bold text-slate-900">Kelola Ujian</h2>

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
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                      Overview
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Jadwal Ujian Hari Ini
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Pantau status pelaksanaan ujian yang sedang dikelola.
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto pb-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-600">
                          No
                        </TableHead>

                        <TableHead className="font-semibold text-slate-600">
                          Nama Ujian
                        </TableHead>

                        <TableHead className="font-semibold text-slate-600">
                          Kelas
                        </TableHead>

                        <TableHead className="font-semibold text-slate-600">
                          Tenggat Waktu
                        </TableHead>

                        <TableHead className="font-semibold text-slate-600">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-36 text-center">
                            Memuat data...
                          </TableCell>
                        </TableRow>
                      ) : dataManageExams.length > 0 ? (
                        dataManageExams.map((item: any, i: number) => {
                          const isComplete =
                            item.lengthStudent.length ===
                            item.lengthStudentCompleteExams?.length;

                          return (
                            <TableRow
                              key={i}
                              className="transition-colors hover:bg-slate-50"
                            >
                              <TableCell className="font-medium text-slate-500">
                                {(page - 1) * pageSize + i + 1}
                              </TableCell>

                              <TableCell className="font-semibold text-slate-800">
                                {item.exams?.nama_ujian || "-"}
                              </TableCell>

                              <TableCell className="text-sm text-slate-600">
                                {item.kelas || "-"}
                              </TableCell>

                              <TableCell className="text-sm text-slate-500">
                                {item.dibuat_tgl} {item.tenggat_waktu}
                              </TableCell>

                              <TableCell>
                                {isComplete ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                    Selesai
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                                    Belum Selesai
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-36 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <ClipboardCheck className="size-8 text-slate-300" />

                              <p className="mt-3 font-semibold text-slate-500">
                                Belum Ada Ujian
                              </p>

                              <p className="mt-1 text-sm text-slate-400">
                                Ujian yang Anda kelola akan muncul di sini.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  <PaginationUi
                    currentPage={page}
                    totalPage={totalPages}
                    onPageChange={setPage}
                    isLoading={isLoading}
                  />
                </div>
              </div>
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
    </MainContent>
  );
}
