"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/data";
import { useConvertDate } from "../../../hooks/getConvertDate";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDataExams } from "@/app/hooks/getScheduleExam";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { useGetDataUsers } from "@/store/useGetDataUsers/state";
import MainContent from "@/layout/mainContent/content";
import { Check, History, Trophy } from "lucide-react";
import HamburgerMenu from "@/components/global/hamburgerMenu/content";
import ListSidebar from "@/components/global/listSidebar/content";
import HeaderProfile from "@/layout/headerProfile/content";

type DataHistoryExams = {
  student_id: string;
  exam_id: number;
  hasil_ujian: string;
  kelas: string;
};

export default function Profil() {
  const getIdStudent = useGetIdUsers((state) => state.idUser);
  const dataStudent = useGetDataUsers((state) => state.dataUsers);
  const getHistoryStudent = useDataExams(dataStudent, getIdStudent);
  const [resultExamPerClass, setResultExamPerClass] = useState<
    DataHistoryExams[]
  >([]);

  useEffect(() => {
    async function getHistoryResultExams() {
      const { data, error } = await supabase
        .from("history-exam-student")
        .select("student_id,exam_id,hasil_ujian,kelas")
        .eq("idStudent", getIdStudent)
        .limit(1);
      if (error) {
        console.log("Gagal mengambil data");
        setResultExamPerClass([]);
      } else {
        setResultExamPerClass(data);
      }
    }
    getHistoryResultExams();
  }, []);

  function rankingClasses() {
    if (!resultExamPerClass?.length || !dataStudent?.classes) {
      return { ranking: 0, lenStudentPerClass: 0 };
    }

    const normalizedResults = resultExamPerClass.map((item) => ({
      ...item,
      hasil_ujian:
        item.hasil_ujian !== "telat" && item.hasil_ujian !== "pending"
          ? item.hasil_ujian
          : "0",
    }));

    type StudentScores = {
      student_id: string;
      pointExams: number[];
    };

    type ClassGroup = {
      kelas: string;
      resultExam: StudentScores[];
    };

    const groupedByClass = normalizedResults.reduce<ClassGroup[]>(
      (acc, cur) => {
        const classGroup = acc.find((group) => group.kelas === cur.kelas);
        const score = Number(cur.hasil_ujian);

        if (!classGroup) {
          acc.push({
            kelas: cur.kelas,
            resultExam: [
              {
                student_id: cur.student_id,
                pointExams: [score],
              },
            ],
          });
        } else {
          const studentItem = classGroup.resultExam.find(
            (item) => item.student_id === cur.student_id,
          );

          if (studentItem) {
            studentItem.pointExams.push(score);
          } else {
            classGroup.resultExam.push({
              student_id: cur.student_id,
              pointExams: [score],
            });
          }
        }

        return acc;
      },
      [],
    );

    // Step 3: Calculate total scores for current class
    const currentClassData = groupedByClass.find(
      (group) => group.kelas === dataStudent.classes,
    );

    if (!currentClassData?.resultExam.length) {
      return { ranking: 0, lenStudentPerClass: 0 };
    }

    const totalScores = currentClassData.resultExam.map((item) => ({
      ...item,
      pointExams: item.pointExams.reduce((sum, score) => sum + score, 0),
    }));

    // Step 4: Sort by score (descending)
    const sortedByScore = [...totalScores].sort(
      (a, b) => b.pointExams - a.pointExams,
    );

    // Step 5: Add ranks (handling ties)
    let lastScore: number | null = null;
    let currentRank = 0;

    const withRanking = sortedByScore.map((item, index) => {
      if (item.pointExams !== lastScore) {
        currentRank = index + 1;
        lastScore = item.pointExams;
      }
      return { ...item, ranking: currentRank };
    });

    // Step 6: Find current student's ranking
    const studentRanking = withRanking.find(
      (item) => item.student_id === getIdStudent,
    );

    return {
      ranking: studentRanking?.ranking ?? 0,
      lenStudentPerClass: totalScores.length,
    };
  }

  async function handleEditProfileStudent(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const resultPayload = Object.fromEntries(formData.entries());

    const { error } = await supabase
      .from("account-student")
      .update(resultPayload)
      .eq("idStudent", getIdStudent);

    if (error) {
      toast("Gagal ❌", {
        description: "Edit Profil Gagal",
      });
    } else {
      toast("Berhasil ✅", {
        description: "Edit Profil Berhasil Di Update",
      });
    }
  }

  return (
    <MainContent>
      {getHistoryStudent.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-3xl font-bold">Profil Siswa</h1>
            <HamburgerMenu>
              <ListSidebar />
            </HamburgerMenu>
          </div>
          <div className="w-full h-0.5 bg-slate-700 rounded-lg" />
          <div className="mt-7 space-y-6">
            <HeaderProfile>
              {/* Identity */}
              <div className="flex-1 space-y-3">
                <h2 className="text-3xl font-extrabold capitalize">
                  {dataStudent?.fullName || ""}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold backdrop-blur-sm shadow-sm">
                    NIS. {dataStudent?.nis || "-"}
                  </span>

                  <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold backdrop-blur-sm shadow-sm">
                    Kelas {dataStudent?.classes || "-"}
                  </span>
                </div>
              </div>

              {/* Edit */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-xl border border-white/20 bg-white px-5 font-semibold text-blue-600 shadow-md hover:bg-blue-50">
                    Edit Profil
                  </Button>
                </DialogTrigger>

                <DialogContent className="rounded-2xl sm:max-w-lg">
                  <form
                    className="grid gap-5"
                    onSubmit={(event) => handleEditProfileStudent(event)}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Edit Profil
                      </DialogTitle>

                      <DialogDescription>
                        Perbarui informasi akun yang ingin Anda ubah.
                      </DialogDescription>
                    </DialogHeader>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Email
                      </label>

                      <Input
                        type="email"
                        name="email"
                        id="email"
                        className="h-11 rounded-xl"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Password Baru
                      </label>

                      <Input
                        type="password"
                        name="password"
                        id="password"
                        className="h-11 rounded-xl"
                      />
                    </div>

                    <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-700">
                      Kosongkan field yang tidak ingin diubah.
                    </p>

                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline" className="rounded-xl">
                          Batal
                        </Button>
                      </DialogClose>

                      <Button
                        type="submit"
                        className="rounded-xl bg-blue-600 hover:bg-blue-700"
                      >
                        Simpan Perubahan
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </HeaderProfile>

            {/* ================= EXAM STATISTICS ================= */}
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <History className="size-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Riwayat Ujian
                    </h2>

                    <p className="text-sm text-slate-500">
                      Ringkasan aktivitas ujian Anda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Completed */}
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Ujian Selesai
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-slate-900">
                        {getHistoryStudent.length || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Total ujian yang telah dikerjakan
                      </p>
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Check className="size-6" />
                    </div>
                  </div>
                </div>

                {/* Ranking */}
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Peringkat Kelas
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-slate-900">
                        {rankingClasses().ranking || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Dari {rankingClasses().lenStudentPerClass || 0} siswa
                      </p>
                    </div>

                    <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Trophy className="size-6" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= HISTORY TABLE ================= */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm pb-5">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    Riwayat Ujian
                  </h2>

                  <p className="text-sm text-slate-500">
                    Daftar ujian yang pernah anda ikuti.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-600 text-sm">
                        No
                      </TableHead>

                      <TableHead className="font-semibold text-slate-600 text-sm">
                        Nama Ujian
                      </TableHead>

                      <TableHead className="font-semibold text-slate-600 text-sm">
                        Tanggal
                      </TableHead>

                      <TableHead className="font-semibold text-slate-600 text-sm">
                        Nilai
                      </TableHead>

                      <TableHead className="font-semibold text-slate-600 text-sm">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {getHistoryStudent.length > 0 ? (
                      getHistoryStudent.map((item: any, i: number) => (
                        <TableRow
                          key={i}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <TableCell className="font-medium text-slate-500">
                            {i + 1}
                          </TableCell>

                          <TableCell className="font-semibold text-slate-800">
                            {item.exams?.nama_ujian || "-"}
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
                            <span className="font-bold text-slate-800">
                              {item.hasil_ujian ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell>
                            {item.status_exam === true ? (
                              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                Selesai
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                                Belum Selesai
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-36 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <History className="size-8 text-slate-300" />

                            <p className="mt-3 font-semibold text-slate-500">
                              Belum Ada Riwayat
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              Riwayat ujian Anda akan muncul di sini.
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
        <div className="space-y-6">
          {/* ================= PROFILE HERO ================= */}
          <section className="overflow-hidden rounded-3xl bg-slate-200 p-6 shadow-sm animate-pulse sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Profile Image */}
              <div className="size-24 shrink-0 rounded-full bg-slate-300 sm:size-28" />

              {/* Identity */}
              <div className="w-full">
                <div className="h-3 w-28 rounded bg-slate-300" />

                <div className="mt-3 h-8 w-64 max-w-full rounded-md bg-slate-300 sm:h-9" />

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-7 w-24 rounded-full bg-slate-300" />
                  <div className="h-7 w-28 rounded-full bg-slate-300" />
                </div>
              </div>

              {/* Edit Button */}
              <div className="h-11 w-full rounded-xl bg-slate-300 sm:w-32" />
            </div>
          </section>

          {/* ================= ACCOUNT INFORMATION ================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Heading */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3 animate-pulse">
                <div className="size-10 rounded-xl bg-slate-200" />

                <div>
                  <div className="h-6 w-40 rounded-md bg-slate-200" />
                  <div className="mt-2 h-3 w-56 rounded bg-slate-100" />
                </div>
              </div>
            </div>

            {/* Information Rows */}
            <div className="divide-y divide-slate-100 animate-pulse">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-3 sm:px-6"
                >
                  <div className="h-4 w-24 rounded bg-slate-200" />

                  <div className="h-4 w-52 max-w-full rounded bg-slate-100 sm:col-span-2" />
                </div>
              ))}
            </div>
          </section>

          {/* ================= EXAM STATISTICS ================= */}
          <section>
            {/* Heading */}
            <div className="mb-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-200" />

                <div>
                  <div className="h-6 w-36 rounded-md bg-slate-200" />
                  <div className="mt-2 h-3 w-56 rounded bg-slate-100" />
                </div>
              </div>
            </div>

            {/* Statistic Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          {/* ================= EXAM HISTORY ================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Heading */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="animate-pulse">
                <div className="h-6 w-36 rounded-md bg-slate-200" />

                <div className="mt-2 h-3 w-64 max-w-full rounded bg-slate-100" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[760px] animate-pulse">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_2fr_1.5fr_1fr_1.2fr] gap-4 bg-slate-50 px-5 py-4">
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                </div>

                {/* Table Rows */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[60px_2fr_1.5fr_1fr_1.2fr] gap-4 border-t border-slate-100 px-5 py-5"
                  >
                    <div className="h-4 w-6 rounded bg-slate-100" />

                    <div className="h-4 w-44 rounded bg-slate-100" />

                    <div className="h-4 w-32 rounded bg-slate-100" />

                    <div className="h-6 w-16 rounded-full bg-slate-100" />

                    <div className="h-6 w-24 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </MainContent>
  );
}
