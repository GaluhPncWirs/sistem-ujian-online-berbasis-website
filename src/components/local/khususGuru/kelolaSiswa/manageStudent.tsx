"use client";
import { useResultExamDataStudent } from "@/app/hooks/getDataResultStudent";
import PaginationUi from "@/components/global/pagination/content";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ManageStudent() {
  const idTeacher = useGetIdUsers((state) => state.idUser);
  const [page, setPage] = useState(1);
  const { resultExamsStudent, totalData, isLoading, pageSize } =
    useResultExamDataStudent(idTeacher, page);
  const totalPages = Math.ceil(totalData / pageSize);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Student Results
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Hasil Ujian Siswa
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Pantau nilai dan status pengerjaan ujian setiap siswa.
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            {resultExamsStudent.length} Siswa
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-14 font-semibold text-slate-600">
                No
              </TableHead>

              <TableHead className="min-w-[190px] font-semibold text-slate-600">
                Siswa
              </TableHead>

              <TableHead className="min-w-[260px] font-semibold text-slate-600">
                Ujian
              </TableHead>

              <TableHead className="min-w-[140px] font-semibold text-slate-600">
                Nilai
              </TableHead>

              <TableHead className="min-w-[170px] font-semibold text-slate-600">
                Status Tugas
              </TableHead>

              <TableHead className="min-w-[120px] font-semibold text-slate-600">
                Kelas
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {resultExamsStudent.length > 0 ? (
              resultExamsStudent.map((data: any, i: number) => (
                <TableRow
                  key={data.student_id ?? i}
                  className="align-top transition-colors hover:bg-slate-50"
                >
                  {/* No */}
                  <TableCell className="pt-5 font-semibold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </TableCell>

                  {/* Student */}
                  <TableCell className="pt-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                        {data.fullName?.charAt(0)?.toUpperCase() || "S"}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {data.fullName || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          ID: {data.student_id || "-"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Exam */}
                  <TableCell className="pt-5">
                    <div className="space-y-2">
                      {data.resultUjian?.length > 0 ? (
                        data.resultUjian.map((item: any, examIndex: number) => (
                          <div
                            key={item.idUjian ?? examIndex}
                            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                          >
                            <div className="flex items-start gap-3">
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-500 shadow-sm">
                                {examIndex + 1}
                              </span>

                              <div className="min-w-0">
                                <p className="font-semibold leading-5 text-slate-800">
                                  {item.namaUjian || "-"}
                                </p>

                                <span className="mt-1 inline-flex rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                  {item.tipe_ujian === "essay"
                                    ? "Essay"
                                    : "Pilihan Ganda"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">
                          Belum ada ujian
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Score */}
                  <TableCell className="pt-5">
                    <div className="space-y-2">
                      {data.resultUjian?.length > 0 ? (
                        data.resultUjian.map(
                          (nilaiUjian: any, examIndex: number) => {
                            const isPending =
                              nilaiUjian.hasil_ujian === "pending";

                            const isEssay = nilaiUjian.tipe_ujian === "essay";

                            return (
                              <div
                                key={nilaiUjian.idUjian ?? `score-${examIndex}`}
                                className="flex min-h-[42px] items-center"
                              >
                                {isPending && isEssay ? (
                                  <HoverCard>
                                    <HoverCardTrigger asChild>
                                      <Link
                                        href={`/Teacher/dashboard/correctionEssay/${nilaiUjian.idUjian}/${data.student_id}`}
                                        className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 transition-colors hover:bg-amber-100"
                                      >
                                        Perlu Dinilai
                                      </Link>
                                    </HoverCardTrigger>

                                    <HoverCardContent className="w-fit rounded-xl p-3">
                                      <p className="text-xs font-semibold text-slate-600">
                                        Beri nilai untuk jawaban essay siswa
                                      </p>
                                    </HoverCardContent>
                                  </HoverCard>
                                ) : (
                                  <span
                                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                                      nilaiUjian.hasil_ujian === "pending"
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-emerald-50 text-emerald-600"
                                    }`}
                                  >
                                    {nilaiUjian.hasil_ujian === "pending"
                                      ? "Pending"
                                      : (nilaiUjian.hasil_ujian ?? "-")}
                                  </span>
                                )}
                              </div>
                            );
                          },
                        )
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="pt-5">
                    <div className="space-y-2">
                      {data.resultUjian?.length > 0 ? (
                        data.resultUjian.map(
                          (statusUjian: any, examIndex: number) => (
                            <div
                              key={statusUjian.idUjian ?? `status-${examIndex}`}
                              className="flex min-h-[42px] items-center"
                            >
                              {statusUjian.status_exam === true ? (
                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                                  Selesai
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                                  Belum Selesai
                                </span>
                              )}
                            </div>
                          ),
                        )
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Class */}
                  <TableCell className="pt-5">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {data.classes || "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ClipboardList className="size-9 text-slate-300" />

                    <p className="mt-3 font-semibold text-slate-500">
                      Belum Ada Data Siswa
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Hasil ujian siswa akan muncul di sini setelah tersedia.
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
  );
}
