"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import MainContent from "@/layout/mainContent/content";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

export default function ResultExamComponent() {
  const params = useParams();
  const [getDataStudentAnswer, setGetDataStudentAnswer] = useState<any | null>(
    null,
  );
  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    async function getDataAnswer() {
      try {
        const req = await fetch(`/api/resultExam?id=${id}`, {
          method: "GET",
          cache: "no-store",
        });
        const response = await req.json();
        setGetDataStudentAnswer(response.dataResultExams);
      } catch (err) {
        console.error("Gagal Mengambil Data Ujian");
      }
    }
    getDataAnswer();
  }, [id]);

  function correctAnswer(questionsId: string, pg: string) {
    if (!getDataStudentAnswer) return null;
    const answerStudentObj = getDataStudentAnswer?.answer_student;
    const studentAnswer = answerStudentObj[questionsId];
    return studentAnswer === pg && "bg-blue-400 rounded-sm py-1 font-semibold";
  }

  return (
    <MainContent>
      {getDataStudentAnswer ? (
        <div className="space-y-8">
          {/* ================= HEADER / RESULT SUMMARY ================= */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-100 sm:p-8">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-white/5" />

            <div className="relative z-10">
              <Link
                href="/Student/Dashboard"
                className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <ArrowLeft className="size-4" />
                Kembali ke Dashboard
              </Link>

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                Result Review
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Hasil Ujian
              </h1>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  {getDataStudentAnswer.exams?.nama_ujian}
                </h2>

                <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                  {getDataStudentAnswer.exams?.tipeUjian === "pg"
                    ? "Pilihan Ganda"
                    : "Essay"}
                </span>
              </div>
            </div>
          </section>

          {/* ================= QUESTIONS ================= */}
          <section>
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Review Jawaban
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Pembahasan Jawaban
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Periksa kembali jawaban yang telah Anda berikan pada setiap
                soal.
              </p>
            </div>

            {getDataStudentAnswer.exams?.tipeUjian === "pg" ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {getDataStudentAnswer.exams?.questions_exam.map(
                  (item: any, i: number) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                    >
                      {/* Question Header */}
                      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          <h3 className="pt-1 text-base font-bold leading-6 text-slate-900">
                            {item.questions}
                          </h3>
                        </div>
                      </div>

                      {/* Answers */}
                      <div className="p-5">
                        <ul className="flex flex-col gap-3">
                          {["a", "b", "c", "d", "e"].map((opt) => {
                            const answerKey = `answer_${opt}`;
                            const answerText = item.answerPg[answerKey];

                            return (
                              <li
                                key={opt}
                                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${correctAnswer(
                                  item.id,
                                  answerText,
                                )}`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/70 text-xs font-bold">
                                    {opt.toUpperCase()}
                                  </span>

                                  <span className="leading-6">
                                    {answerText}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {getDataStudentAnswer.exams?.questions_exam.map(
                  (item: any, i: number) => (
                    <div
                      key={item.id ?? i}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      {/* Question */}
                      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          <h3 className="pt-1 text-base font-bold leading-6 text-slate-900">
                            {item.questions}
                          </h3>
                        </div>
                      </div>

                      {/* Student Answer */}
                      <div className="p-5">
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-700">
                            Jawaban Anda
                          </label>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            Essay
                          </span>
                        </div>

                        <Textarea
                          disabled
                          value={
                            getDataStudentAnswer.answer_student?.[item.id] || ""
                          }
                          className="min-h-32 resize-none rounded-xl border-slate-200 bg-slate-50 text-sm leading-6 text-slate-700"
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* ================= BACK BUTTON ================= */}
          <div className="flex justify-center pb-4 sm:justify-start">
            <Link
              href="/Student/Dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            >
              <ArrowLeft className="size-5" />
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ================= RESULT HEADER ================= */}
          <section className="overflow-hidden rounded-3xl bg-slate-200 p-6 shadow-sm animate-pulse sm:p-8">
            {/* Back Button */}
            <div className="h-9 w-40 rounded-lg bg-slate-300" />

            {/* Heading */}
            <div className="mt-7">
              <div className="h-3 w-28 rounded bg-slate-300" />

              <div className="mt-3 h-9 w-40 rounded-md bg-slate-300 sm:h-10" />

              {/* Exam Name */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="h-5 w-64 max-w-full rounded bg-slate-300" />
                <div className="h-7 w-28 rounded-full bg-slate-300" />
              </div>
            </div>
          </section>

          {/* ================= REVIEW HEADER ================= */}
          <section className="mt-8">
            <div className="mb-5 animate-pulse">
              <div className="h-3 w-28 rounded bg-slate-200" />

              <div className="mt-2 h-7 w-56 rounded-md bg-slate-200" />

              <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-100" />
            </div>

            {/* ================= QUESTION CARDS ================= */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Question Header */}
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="flex items-start gap-3 animate-pulse">
                      {/* Number */}
                      <div className="size-9 shrink-0 rounded-lg bg-slate-200" />

                      {/* Question Text */}
                      <div className="w-full pt-1">
                        <div className="h-4 w-full max-w-md rounded bg-slate-200" />
                        <div className="mt-2 h-4 w-3/4 max-w-sm rounded bg-slate-100" />
                      </div>
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div className="p-5">
                    <div className="flex flex-col gap-3 animate-pulse">
                      {[1, 2, 3, 4].map((option) => (
                        <div
                          key={option}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3"
                        >
                          <div className="size-7 shrink-0 rounded-lg bg-slate-100" />

                          <div
                            className={`h-4 rounded bg-slate-100 ${
                              option === 1
                                ? "w-3/4"
                                : option === 2
                                  ? "w-full"
                                  : option === 3
                                    ? "w-2/3"
                                    : "w-4/5"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= BACK BUTTON ================= */}
          <div className="flex justify-center pb-4 pt-2 sm:justify-start">
            <div className="h-11 w-48 rounded-xl bg-slate-200 animate-pulse" />
          </div>
        </>
      )}
    </MainContent>
  );
}
