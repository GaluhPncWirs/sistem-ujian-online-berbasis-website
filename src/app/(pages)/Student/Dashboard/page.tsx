"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConvertDate } from "../../../hooks/getConvertDate";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import HeaderDasboard from "@/components/local/forDasboard/content";
import { useDataExams } from "@/app/hooks/getDataExams";
import { toast } from "sonner";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { useGetDataUsers } from "@/store/useGetDataUsers/state";
import MainContent from "@/layout/mainContent/content";
import { BarChart3, BellRing, CalendarClock } from "lucide-react";
import {
  convertToNumber,
  getCurrentTimeInMinutes,
  getDateKey,
} from "@/lib/utils/convertDate";
import { promise } from "zod";

type ExamStatus = "BELUM_MULAI" | "BERLANGSUNG" | "LEWAT";

function getExamStatus(tenggatWaktu: string, tglUjian: string): ExamStatus {
  const { start, end } = convertToNumber(tenggatWaktu);

  const today = getDateKey(new Date());
  const examDate = getDateKey(tglUjian);
  const currentMinute = getCurrentTimeInMinutes();

  if (!today || !examDate || Number.isNaN(start) || Number.isNaN(end)) {
    return "LEWAT";
  }

  if (examDate > today) {
    return "BELUM_MULAI";
  }

  if (examDate < today) {
    return "LEWAT";
  }

  if (currentMinute < start) {
    return "BELUM_MULAI";
  }

  if (currentMinute >= end) {
    return "LEWAT";
  }

  return "BERLANGSUNG";
}

export default function DashboardStudent() {
  const getIdStudent = useGetIdUsers((state) => state.idUser);
  const dataStudent = useGetDataUsers((state) => state.dataUsers);
  const scheduleExams = useDataExams(dataStudent, getIdStudent);
  const { push } = useRouter();
  const [confirm, setConfirm] = useState<number>(0);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [lateExam, setLateExam] = useState([]);

  const filterScoreExams = scheduleExams.filter(
    (exams: { status_exam: boolean; hasil_ujian: string }) => {
      if (!exams.status_exam) return false;
      if (exams.hasil_ujian === "pending" || exams.hasil_ujian === "telat") {
        return false;
      }

      const score = Number(exams.hasil_ujian);

      return Number.isFinite(score);
    },
  );

  const totalScore = filterScoreExams.reduce((total, exam) => {
    return total + Number(exam.hasil_ujian);
  }, 0);

  const averageValue =
    filterScoreExams.length > 0
      ? Math.round((totalScore / filterScoreExams.length) * 100) / 100
      : 0;

  const lateExams = useCallback(async (idUjian: number) => {
    if (!getIdStudent) return;

    const { data: existingExam, error: fetchError } = await supabase
      .from("history-exam-student")
      .select("id, hasil_ujian, status_exam")
      .eq("student_id", getIdStudent)
      .eq("exam_id", Number(idUjian))
      .maybeSingle();

    if (fetchError) {
      console.error("Gagal mengecek history ujian:", fetchError);
      return;
    }

    if (existingExam) {
      return;
    }

    const payload = {
      created_at: new Date().toISOString(),
      student_id: getIdStudent,
      exam_id: Number(idUjian),
      answer_student: null,
      hasil_ujian: "telat",
      status_exam: true,
      kelas: dataStudent?.classes,
    };

    const { error: insertError } = await supabase
      .from("history-exam-student")
      .insert(payload);

    if (insertError) {
      toast("❌ Gagal Simpan Data", {
        description: insertError.message,
      });
      return;
    }
  }, []);

  useEffect(() => {
    if (!scheduleExams.length) {
      setLateExam([]);
      return;
    }

    const lateExamsList = scheduleExams.filter(
      (exam: {
        tenggat_waktu: string;
        dibuat_tgl: string;
        idExams: number;
      }) => {
        return getExamStatus(exam.tenggat_waktu, exam.dibuat_tgl) === "LEWAT";
      },
    );

    setLateExam(lateExamsList);

    if (lateExamsList.length === 0) {
      return;
    }

    async function saveLateExams() {
      await Promise.all(
        lateExamsList.map((exam: { idExams: number }) =>
          lateExams(exam.idExams),
        ),
      );
    }

    saveLateExams();
  }, [scheduleExams]);

  function deadlineUjianTercepatHariIni() {
    const today = getDateKey(new Date());
    const currentMinute = getCurrentTimeInMinutes();

    const upcomingExams = scheduleExams.filter(
      (exam: {
        status_exam: boolean;
        dibuat_tgl: string;
        tenggat_waktu: string;
      }) => {
        if (exam.status_exam) return false;

        const examDate = getDateKey(exam.dibuat_tgl);

        if (examDate !== today) return false;

        const { start, end } = convertToNumber(exam.tenggat_waktu);

        if (Number.isNaN(start) || Number.isNaN(end)) {
          return false;
        }

        // Ujian yang belum selesai
        return currentMinute < end;
      },
    );

    if (upcomingExams.length === 0) {
      return null;
    }

    return upcomingExams.reduce(
      (
        closestExam: {
          tenggat_waktu: string;
        },
        currentExam: {
          tenggat_waktu: string;
        },
      ) => {
        const closestDeadline = convertToNumber(closestExam.tenggat_waktu).end;

        const currentDeadline = convertToNumber(currentExam.tenggat_waktu).end;

        return currentDeadline < closestDeadline ? currentExam : closestExam;
      },
    );
  }

  useEffect(() => {
    if (accepted) {
      setConfirm(5);
      const timer = setInterval(() => {
        setConfirm((prev: number) => {
          if (prev <= 0) {
            clearInterval(timer);
            setAccepted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [accepted]);

  return (
    <MainContent>
      {dataStudent !== null ? (
        <>
          <HeaderDasboard
            user="Siswa"
            fullName={dataStudent?.fullName}
            exams={scheduleExams}
          />
          <div className="space-y-8">
            {/* Summary */}
            <section>
              <div className="mb-5 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Overview
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Ringkasan Ujian
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Pantau ujian yang tersedia dan perkembangan hasil ujian Anda.
                </p>
              </div>

              {/* Statistic Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Ujian Terjadwal */}
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Ujian Terjadwal
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-slate-900">
                        {scheduleExams.filter(
                          (done: { status_exam: boolean }) =>
                            done.status_exam !== true,
                        ).length || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Ujian yang belum diselesaikan
                      </p>
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <CalendarClock className="size-6" strokeWidth={1.8} />
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
                        {Math.round(averageValue) || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Berdasarkan ujian yang telah selesai
                      </p>
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <BarChart3 className="size-6" strokeWidth={1.8} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Deadline Exam */}
            {deadlineUjianTercepatHariIni() && (
              <section>
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                    Perlu Diperhatikan
                  </p>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    Ujian Segera Berakhir
                  </h2>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm sm:p-6">
                  <div className="absolute -right-10 -top-10 size-40 rounded-full bg-amber-100/50 blur-2xl" />

                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <BellRing className="size-6" strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                          Deadline Terdekat
                        </p>

                        <h3 className="mt-1 text-xl font-bold text-slate-900">
                          {deadlineUjianTercepatHariIni()?.exams.nama_ujian}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {deadlineUjianTercepatHariIni()?.dibuat_tgl} ·{" "}
                          {deadlineUjianTercepatHariIni()?.tenggat_waktu}
                        </p>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setAccepted(true)}
                          className="w-full rounded-xl bg-amber-500 px-6 font-semibold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 sm:w-auto"
                        >
                          Mulai Ujian
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="rounded-2xl sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">
                            Konfirmasi Masuk Ujian
                          </DialogTitle>

                          <DialogDescription className="pt-2 text-left leading-6">
                            Apakah Anda yakin ingin mengerjakan soal{" "}
                            <span className="font-bold text-slate-900">
                              "
                              {deadlineUjianTercepatHariIni()?.exams
                                .nama_ujian || ""}
                              "
                            </span>
                            ?
                            <span className="mt-3 block">
                              Pastikan Anda sudah siap. Setelah masuk ke halaman
                              ujian, Anda tidak dapat kembali ke dashboard.
                            </span>
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="mt-4 gap-2">
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              onClick={() => setAccepted(false)}
                              className="rounded-xl"
                            >
                              Batal
                            </Button>
                          </DialogClose>

                          <DialogClose asChild>
                            <Button
                              onClick={() =>
                                push(
                                  `/Student/Exams/StartExam/${deadlineUjianTercepatHariIni().idExams}`,
                                )
                              }
                              className="rounded-xl bg-blue-600 hover:bg-blue-700"
                              disabled={accepted}
                            >
                              {confirm <= 0 ? "Mulai" : confirm}
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </section>
            )}

            {/* Available Exams */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900">
                      Ujian Tersedia
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Daftar ujian yang tersedia untuk Anda.
                    </p>
                  </div>

                  <div className="hidden rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 sm:block">
                    {scheduleExams.length} Ujian
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-sm text-slate-600">
                        No
                      </TableHead>
                      <TableHead className="font-semibold text-sm text-slate-600">
                        Nama Ujian
                      </TableHead>
                      <TableHead className="font-semibold text-sm text-slate-600">
                        Waktu Tenggat
                      </TableHead>
                      <TableHead className="font-semibold text-sm text-slate-600">
                        Guru Pengampu
                      </TableHead>
                      <TableHead className="font-semibold text-sm text-slate-600">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {scheduleExams.length > 0 ? (
                      scheduleExams.map((data: any, i: number) => {
                        const status = getExamStatus(
                          data.tenggat_waktu,
                          data.dibuat_tgl,
                        );

                        return (
                          <TableRow
                            key={i}
                            className="transition-colors hover:bg-slate-50"
                          >
                            <TableCell className="font-medium text-slate-500">
                              {i + 1}
                            </TableCell>

                            <TableCell className="font-semibold text-slate-800">
                              {data.exams.nama_ujian}
                            </TableCell>

                            <TableCell className="text-sm text-slate-500">
                              {data.dibuat_tgl} {data.tenggat_waktu}
                            </TableCell>

                            <TableCell className="text-sm text-slate-600">
                              {data.account_teacher.fullName}
                            </TableCell>

                            <TableCell>
                              {data.status_exam === true &&
                              data.hasil_ujian !== "telat" ? (
                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                  Selesai
                                </span>
                              ) : data.status_exam === true &&
                                data.hasil_ujian === "telat" ? (
                                <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                                  Telat
                                </span>
                              ) : status === "BELUM_MULAI" ? (
                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                  Belum Dimulai
                                </span>
                              ) : status === "LEWAT" ? (
                                <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                                  Lewat Batas Waktu
                                </span>
                              ) : (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <button className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100">
                                      Sedang Berlangsung
                                    </button>
                                  </DialogTrigger>

                                  <DialogContent className="rounded-2xl sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl font-bold">
                                        Konfirmasi Masuk Ujian
                                      </DialogTitle>

                                      <DialogDescription className="pt-2">
                                        Yakin ingin masuk ke ujian{" "}
                                        <span className="font-bold text-slate-900">
                                          "{data.exams.nama_ujian}"
                                        </span>
                                        ?
                                      </DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter className="mt-4 gap-2">
                                      <DialogClose asChild>
                                        <Button
                                          variant="outline"
                                          className="rounded-xl"
                                        >
                                          Batal
                                        </Button>
                                      </DialogClose>

                                      <Button
                                        onClick={() =>
                                          push(
                                            `/Student/Exams/StartExam?idExams=${data.idExams}`,
                                          )
                                        }
                                        className="rounded-xl bg-blue-600 hover:bg-blue-700"
                                      >
                                        Mulai
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarClock className="size-8 text-slate-300" />

                            <p className="mt-2 font-semibold text-slate-500">
                              Belum Ada Ujian
                            </p>

                            <p className="text-sm text-slate-400">
                              Ujian yang tersedia akan muncul di sini.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>

            {/* Recent Scores */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    Nilai Terakhir
                  </h2>

                  <p className="text-sm text-slate-500">
                    Riwayat hasil ujian yang telah Anda selesaikan.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
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
                        Tanggal Pengerjaan
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Nilai
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {scheduleExams.length > 0 ? (
                      scheduleExams.map((item: any, i: number) =>
                        item.status_exam === true &&
                        item.hasil_ujian !== "telat" ? (
                          <TableRow
                            key={i}
                            className="transition-colors hover:bg-slate-50"
                          >
                            <TableCell className="font-medium text-slate-500">
                              {i + 1}
                            </TableCell>

                            <TableCell>
                              <HoverCard openDelay={200} closeDelay={200}>
                                <HoverCardTrigger asChild>
                                  <Link
                                    href={`/Student/Dashboard/ResultExam/${item.idExams}`}
                                    className="font-semibold text-slate-800 transition-colors hover:text-blue-600 hover:underline"
                                  >
                                    {item.exams.nama_ujian}
                                  </Link>
                                </HoverCardTrigger>

                                <HoverCardContent className="w-fit rounded-lg p-3">
                                  <p className="text-xs font-medium text-slate-600">
                                    Lihat hasil ujian
                                  </p>
                                </HoverCardContent>
                              </HoverCard>
                            </TableCell>

                            <TableCell className="text-sm text-slate-500">
                              {useConvertDate(item.created_at_historyExams, {
                                minute: "numeric",
                                hour: "numeric",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </TableCell>

                            <TableCell>
                              {item.hasil_ujian !== "telat" ? (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600">
                                  {item.tipe_ujian === "pg"
                                    ? `${item.hasil_ujian} / 100`
                                    : item.hasil_ujian !== "pending"
                                      ? `${item.hasil_ujian} / 100`
                                      : "Pending"}
                                </span>
                              ) : (
                                <span className="text-sm font-semibold text-red-500">
                                  Tidak Ada Nilai
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ) : lateExam.length > 0 ? (
                          <TableRow key={i}>
                            <TableCell
                              colSpan={4}
                              className="h-24 text-center font-semibold text-red-500"
                            >
                              Telat Melakukan Ujian
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={i}>
                            <TableCell
                              colSpan={4}
                              className="h-24 text-center font-semibold text-slate-400"
                            >
                              Belum Ada Nilai
                            </TableCell>
                          </TableRow>
                        ),
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <BarChart3 className="size-8 text-slate-300" />

                            <p className="mt-2 font-semibold text-slate-500">
                              Belum Ada Nilai
                            </p>

                            <p className="text-sm text-slate-400">
                              Hasil ujian akan muncul setelah Anda menyelesaikan
                              ujian.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
          {/* ==================== HEADER ==================== */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-200 p-6 animate-pulse sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Profile */}
              <div className="size-20 shrink-0 rounded-full bg-slate-300 sm:size-24" />

              {/* Heading */}
              <div className="w-full max-w-xl">
                <div className="h-3 w-28 rounded bg-slate-300" />

                <div className="mt-3 h-8 w-56 rounded-md bg-slate-300 sm:h-9" />

                <div className="mt-3 h-4 w-full max-w-md rounded bg-slate-300" />
                <div className="mt-2 h-4 w-3/4 max-w-sm rounded bg-slate-300" />
              </div>
            </div>
          </section>

          {/* ==================== SUMMARY ==================== */}
          <section className="mt-8">
            {/* Heading */}
            <div>
              <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />

              <div className="mt-2 h-7 w-48 rounded-md bg-slate-200 animate-pulse" />

              <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-100 animate-pulse" />
            </div>

            {/* Statistic Cards */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2].map((item) => (
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

          {/* ==================== DEADLINE ==================== */}
          <section className="mt-8">
            <div className="mb-4 animate-pulse">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="mt-2 h-7 w-60 rounded-md bg-slate-200" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4 animate-pulse">
                  <div className="size-12 shrink-0 rounded-xl bg-slate-200" />

                  <div className="w-full">
                    <div className="h-3 w-28 rounded bg-slate-100" />

                    <div className="mt-2 h-6 w-60 max-w-full rounded-md bg-slate-200" />

                    <div className="mt-2 h-4 w-44 rounded bg-slate-100" />
                  </div>
                </div>

                <div className="h-11 w-full rounded-xl bg-slate-200 animate-pulse sm:w-32" />
              </div>
            </div>
          </section>

          {/* ==================== AVAILABLE EXAMS ==================== */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Section Header */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="animate-pulse">
                  <div className="h-6 w-40 rounded-md bg-slate-200" />
                  <div className="mt-2 h-3 w-64 max-w-full rounded bg-slate-100" />
                </div>

                <div className="hidden h-7 w-20 rounded-full bg-slate-100 animate-pulse sm:block" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[760px] animate-pulse">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_2fr_1.5fr_1.5fr_1.2fr] gap-4 bg-slate-50 px-5 py-4">
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
                    className="grid grid-cols-[60px_2fr_1.5fr_1.5fr_1.2fr] gap-4 border-t border-slate-100 px-5 py-5"
                  >
                    <div className="h-4 w-6 rounded bg-slate-100" />
                    <div className="h-4 w-40 rounded bg-slate-100" />
                    <div className="h-4 w-28 rounded bg-slate-100" />
                    <div className="h-4 w-32 rounded bg-slate-100" />
                    <div className="h-6 w-24 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ==================== RECENT SCORES ==================== */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Section Header */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="animate-pulse">
                <div className="h-6 w-36 rounded-md bg-slate-200" />
                <div className="mt-2 h-3 w-72 max-w-full rounded bg-slate-100" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[650px] animate-pulse">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_2fr_1.5fr_1fr] gap-4 bg-slate-50 px-5 py-4">
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                </div>

                {/* Rows */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[60px_2fr_1.5fr_1fr] gap-4 border-t border-slate-100 px-5 py-5"
                  >
                    <div className="h-4 w-6 rounded bg-slate-100" />

                    <div className="h-4 w-44 rounded bg-slate-100" />

                    <div className="h-4 w-32 rounded bg-slate-100" />

                    <div className="h-6 w-20 rounded-full bg-slate-100" />
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
