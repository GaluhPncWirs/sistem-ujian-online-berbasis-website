"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/data";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import MainContent from "@/layout/mainContent/content";

const assessmentOptions = [
  {
    label: "Sangat Benar",
    short: "SB",
    value: "100",
  },
  {
    label: "Benar",
    short: "B",
    value: "75",
  },
  {
    label: "Setengah Benar",
    short: "STB",
    value: "50",
  },
  {
    label: "Salah",
    short: "S",
    value: "0",
  },
];

export default function CorrectionEssay() {
  const params = useParams<{
    idExam: string;
    idStudent: string;
  }>();

  const idExam = params.idExam;
  const idStudent = params.idStudent;

  const [viewQuestionsExams, setViewQuestionsExams] = useState<any>(null);

  const [giveAssesmentExams, setGiveAssesmentExams] = useState<
    Record<string, number>
  >({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    if (!idExam || !idStudent) {
      setViewQuestionsExams(null);
      return;
    }

    let isMounted = true;

    async function getExamEssay() {
      const { data, error } = await supabase
        .from("history-exam-student")
        .select(
          `
          student_id,
          exam_id,
          answer_student,
          exams (
            questions_exam,
            nama_ujian
          )
        `,
        )
        .eq("exam_id", Number(idExam))
        .eq("student_id", idStudent)
        .single();

      if (error) {
        console.error("Gagal mengambil data essay:", error);

        return;
      }

      if (!isMounted) return;

      setViewQuestionsExams(data);
    }

    getExamEssay();

    return () => {
      isMounted = false;
    };
  }, [idExam, idStudent]);

  function handleChooseAssesment(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setGiveAssesmentExams((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  const finalResultAssesment = useMemo(() => {
    const values = Object.values(giveAssesmentExams);

    if (values.length === 0) {
      return 0;
    }

    const totalScore = values.reduce((sum, value) => sum + value, 0);

    const maxScore = values.length * 100;

    return Math.round((totalScore / maxScore) * 100);
  }, [giveAssesmentExams]);

  async function giveAssesment() {
    if (!idExam || !idStudent) {
      toast("Gagal ❌", {
        description: "Data ujian atau siswa tidak ditemukan.",
      });

      return;
    }

    const scores = Object.values(giveAssesmentExams);

    if (scores.length === 0) {
      toast("Gagal ❌", {
        description: "Belum ada nilai yang diberikan.",
      });

      return;
    }

    const { error } = await supabase
      .from("history-exam-student")
      .update({
        hasil_ujian: finalResultAssesment,
      })
      .eq("exam_id", Number(idExam))
      .eq("student_id", idStudent);

    if (error) {
      console.error("Assessment error:", error);

      toast("Gagal ❌", {
        description: "Gagal menilai soal.",
      });

      return;
    }

    toast("Berhasil ✅", {
      description: `Nilai akhir: ${finalResultAssesment}/100`,
    });

    setOpenConfirmDialog(false);
  }

  return (
    <MainContent>
      {Object.values(viewQuestionsExams).length > 0 ? (
        <div className="space-y-6">
          {/* ================= HEADER ================= */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-100 sm:p-8">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100 sm:text-sm">
                Essay Grading
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Koreksi Soal Essay
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-base font-semibold sm:text-lg">
                  {viewQuestionsExams.exams?.nama_ujian}
                </span>

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {viewQuestionsExams.exams?.questions_exam?.length || 0} Soal
                </span>
              </div>
            </div>
          </section>

          {/* ================= INTRO ================= */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4 sm:px-6">
            <p className="text-sm leading-6 text-blue-800">
              Periksa jawaban siswa pada setiap soal, lalu pilih tingkat
              penilaian yang sesuai. Nilai akhir akan dihitung berdasarkan
              seluruh penilaian yang diberikan.
            </p>
          </div>

          {/* ================= QUESTIONS ================= */}
          <section className="space-y-5">
            {viewQuestionsExams.exams?.questions_exam?.map(
              (item: any, i: number) => (
                <article
                  key={item.id ?? i}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Question Header */}
                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Pertanyaan {i + 1}
                        </p>

                        <h2 className="mt-1 break-words text-base font-bold leading-6 text-slate-900 sm:text-lg">
                          {item.questions}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 md:p-6">
                    {/* Student Answer */}
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label className="text-sm font-bold text-slate-700">
                          Jawaban Siswa
                        </label>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          Jawaban
                        </span>
                      </div>

                      <Textarea
                        disabled
                        value={
                          viewQuestionsExams.answer_student?.[item.id] || ""
                        }
                        className="min-h-40 resize-none rounded-xl border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                      />
                    </div>

                    {/* Assessment */}
                    <div>
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-slate-700">
                          Beri Penilaian
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Pilih tingkat kebenaran jawaban siswa.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {assessmentOptions.map((assessment) => (
                          <label
                            key={`${item.id}-${assessment.value}`}
                            className="group flex cursor-pointer flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center transition-all hover:border-blue-200 hover:bg-blue-50"
                          >
                            <Input
                              type="radio"
                              name={item.id}
                              value={assessment.value}
                              onChange={(e) => handleChooseAssesment(e)}
                              className="mb-3 size-5 cursor-pointer accent-blue-600"
                            />

                            <span className="text-sm font-bold text-slate-800">
                              {assessment.short}
                            </span>

                            <span className="mt-1 text-xs leading-4 text-slate-400">
                              {assessment.label}
                            </span>

                            <span className="mt-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600">
                              {assessment.value}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Score Legend */}
                      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                          Keterangan Penilaian
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-amber-800">
                          <div>
                            <span className="font-bold">100</span> — Sangat
                            Benar
                          </div>

                          <div>
                            <span className="font-bold">75</span> — Benar
                          </div>

                          <div>
                            <span className="font-bold">50</span> — Setengah
                            Benar
                          </div>

                          <div>
                            <span className="font-bold">0</span> — Salah
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ),
            )}
          </section>

          {/* ================= ACTION ================= */}
          <section className="sticky bottom-3 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-300/30 backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Nilai Akhir
                </p>

                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {finalResultAssesment}
                  <span className="ml-1 text-base font-semibold text-slate-400">
                    / 100
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/Teacher/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Kembali
                </Link>

                <Dialog
                  open={openConfirmDialog}
                  onOpenChange={setOpenConfirmDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="h-11 rounded-xl bg-blue-600 px-6 font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700"
                      disabled={Object.keys(giveAssesmentExams).length === 0}
                    >
                      Simpan Penilaian
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Konfirmasi Penilaian
                      </DialogTitle>

                      <DialogDescription className="pt-2 leading-6">
                        Apakah penilaian ini sudah benar?
                        <span className="mt-3 block">
                          Nilai akhir ujian siswa:
                        </span>
                        <span className="mt-2 block text-2xl font-extrabold text-blue-600">
                          {finalResultAssesment}/100
                        </span>
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setOpenConfirmDialog(false)}
                      >
                        Periksa Lagi
                      </Button>

                      <Button
                        type="button"
                        onClick={giveAssesment}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700"
                      >
                        Ya, Simpan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <>
          {/* ================= HEADER ================= */}
          <section className="overflow-hidden rounded-3xl bg-slate-200 p-6 shadow-sm animate-pulse sm:p-8">
            <div className="h-3 w-28 rounded bg-slate-300" />

            <div className="mt-3 h-9 w-64 max-w-full rounded-md bg-slate-300" />

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="h-6 w-56 rounded-full bg-slate-300" />
              <div className="h-6 w-20 rounded-full bg-slate-300" />
            </div>
          </section>

          {/* ================= INFO ================= */}
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="animate-pulse">
              <div className="h-4 w-full max-w-3xl rounded bg-slate-200" />
              <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-slate-100" />
            </div>
          </div>

          {/* ================= QUESTIONS ================= */}
          <section className="space-y-5">
            {[1, 2, 3, 4].map((item) => (
              <article
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Question Header */}
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                  <div className="flex items-start gap-3 animate-pulse">
                    <div className="size-9 shrink-0 rounded-lg bg-slate-200" />

                    <div className="w-full">
                      <div className="h-3 w-24 rounded bg-slate-100" />

                      <div className="mt-2 h-5 w-full max-w-2xl rounded bg-slate-200" />

                      <div className="mt-2 h-4 w-3/4 max-w-xl rounded bg-slate-100" />
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 md:p-6">
                  {/* Student Answer */}
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-28 rounded bg-slate-200" />
                      <div className="h-6 w-20 rounded-full bg-slate-100" />
                    </div>

                    <div className="mt-3 h-40 rounded-xl bg-slate-100" />
                  </div>

                  {/* Assessment */}
                  <div className="animate-pulse">
                    <div className="h-4 w-28 rounded bg-slate-200" />

                    <div className="mt-2 h-3 w-56 rounded bg-slate-100" />

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[1, 2, 3, 4].map((score) => (
                        <div
                          key={score}
                          className="rounded-xl border border-slate-100 p-3"
                        >
                          <div className="mx-auto size-5 rounded-full bg-slate-100" />

                          <div className="mx-auto mt-3 h-4 w-8 rounded bg-slate-100" />

                          <div className="mx-auto mt-2 h-3 w-16 rounded bg-slate-100" />

                          <div className="mx-auto mt-2 h-6 w-10 rounded-full bg-slate-100" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 h-24 rounded-xl bg-slate-50" />
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* ================= ACTION BAR ================= */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/30 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
              <div>
                <div className="h-3 w-20 rounded bg-slate-100" />
                <div className="mt-2 h-8 w-24 rounded-md bg-slate-200" />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="h-11 w-24 rounded-xl bg-slate-100" />
                <div className="h-11 w-40 rounded-xl bg-slate-200" />
              </div>
            </div>
          </section>
        </>
      )}
    </MainContent>
  );
}
