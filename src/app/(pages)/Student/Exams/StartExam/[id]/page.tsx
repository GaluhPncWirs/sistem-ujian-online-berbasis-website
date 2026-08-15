"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SoalUjian } from "@/types/halamanUjian";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { Flag, List, Timer, X } from "lucide-react";
import MainContent from "@/layout/mainContent/content";

export default function StartExam() {
  const router = useRouter();
  const params = useParams();
  const idExams = params.id as string;
  const getIdStudent = useGetIdUsers((state) => state.idUser);
  const [questionsExam, setQuestionsExam] = useState<SoalUjian | null>(null);
  const [dataStudent, setDataStudent] = useState<any>(null);
  const [clickedAnswerPg, setClickedAnswerPg] = useState<{
    [questions: string]: string;
  }>({});
  const [isClosedContent, setIsClosedContent] = useState<boolean>(false);
  const [dataUjianRandom, setDataUjianRandom] = useState<any>([]);
  const [isSizeMobile, setIsSizeMobile] = useState<boolean>(false);
  const [time, setTime] = useState<number | null>(null);
  const [answerEssayExams, setAnswerEssayExams] = useState<{
    [questions: string]: string;
  }>({});
  const [markQuestions, setMarkQuestions] = useState<any>({});
  const [timeOutDone, setTimeOutDone] = useState<boolean>(false);
  const [showInformationExam, setShowInformationExam] = useState<boolean>(true);
  const clickedOutsideCheked = useRef<HTMLInputElement | null>(null);
  const handleClickedOutsideContent = useRef<HTMLDivElement | null>(null);
  const clickedMarkQuestions = useRef<HTMLButtonElement | null>(null);
  const clickedAnswerQuestions = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!idExams || !getIdStudent) return;
    async function getDataExams() {
      try {
        const request = await fetch(
          `/api/getQuestions?idExams=${idExams}&idStudent=${getIdStudent}`,
        );
        const response = await request.json();
        if (response.success) {
          setQuestionsExam(response.dataExams);
          setDataStudent(response.dataStudent);
        }
      } catch {
        toast("❌ Error", {
          description: "Data Ujian Gagal Diambil",
        });
      }
    }
    getDataExams();
  }, [idExams, getIdStudent]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    function handler(e: MediaQueryListEvent | MediaQueryList) {
      setIsSizeMobile(e.matches);
    }

    handler(mediaQuery);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (questionsExam?.tipe_ujian === "pg") {
      const savedMark = localStorage.getItem("markQuestions");
      const savedAnswerPg = localStorage.getItem("exam-answer-pg");
      if (savedAnswerPg && savedMark) {
        setClickedAnswerPg(JSON.parse(savedAnswerPg));
        setMarkQuestions(JSON.parse(savedMark));
      }
    }

    if (questionsExam?.tipe_ujian === "essay") {
      const savedMark = localStorage.getItem("markQuestions");
      const savedAnswerEssay = localStorage.getItem("exam-answer-essay");
      if (savedAnswerEssay && savedMark) {
        setAnswerEssayExams(JSON.parse(savedAnswerEssay));
        setMarkQuestions(JSON.parse(savedMark));
      }
    }
  }, [questionsExam?.tipe_ujian]);

  useEffect(() => {
    if (questionsExam?.tipe_ujian === "pg") {
      localStorage.setItem("markQuestions", JSON.stringify(markQuestions));
      localStorage.setItem("exam-answer-pg", JSON.stringify(clickedAnswerPg));
    }

    if (questionsExam?.tipe_ujian === "essay") {
      localStorage.setItem("markQuestions", JSON.stringify(markQuestions));
      localStorage.setItem(
        "exam-answer-essay",
        JSON.stringify(answerEssayExams),
      );
    }
  }, [
    questionsExam?.tipe_ujian,
    clickedAnswerPg,
    markQuestions,
    answerEssayExams,
  ]);

  useEffect(() => {
    if (questionsExam?.exams?.questions_exam) {
      const savedQuestions = localStorage.getItem("random-number-exam");
      if (savedQuestions) {
        setDataUjianRandom(JSON.parse(savedQuestions));
      } else {
        const questions = questionsExam.exams?.questions_exam ?? [];
        const dataExams = [...questions].sort(() => 0.5 - Math.random());
        setDataUjianRandom(dataExams);
        localStorage.setItem("random-number-exam", JSON.stringify(dataExams));
      }
    }
  }, [questionsExam]);

  useEffect(() => {
    function initializedTime() {
      const savedTimer = localStorage.getItem("timer");
      if (savedTimer) {
        const initialTime = JSON.parse(savedTimer);
        return initialTime > 0 ? initialTime : questionsExam?.exam_duration;
      }
      return questionsExam?.exam_duration;
    }

    setTime(initializedTime());
  }, [questionsExam?.exam_duration]);

  useEffect(() => {
    if (time === undefined || time === null) return;
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev! <= 0) {
          clearInterval(timer);
          setTimeOutDone(true);
          return 0;
        }
        const newTime = prev! - 1;
        localStorage.setItem("timer", JSON.stringify(time));
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  const minute = Math.floor(time! / 60);
  const second = time! % 60;
  const formatedTime = `${minute}:${String(second).padStart(2, "0")}`;

  function handleSelectedAnswer(questionsId: string, answer: string) {
    setClickedAnswerPg((prev) => ({
      ...prev,
      [questionsId]: answer,
    }));
  }

  function handleAnswerEmpty() {
    const idSoalYangSudah = Object.keys(clickedAnswerPg);
    const dataUjian = dataUjianRandom.filter(
      (data: any) => !idSoalYangSudah.includes(data.id),
    );
    return dataUjian.length === 0;
  }

  async function handleSendExam() {
    const pilihanSiswa = Object.values(clickedAnswerPg);
    const jawabanYangBenar: any = questionsExam?.exams?.questions_exam
      .flatMap((item: any) => item.correctAnswer)
      .filter((jawabanBenar: any) => pilihanSiswa.includes(jawabanBenar));
    const resultExam = Math.round(
      (jawabanYangBenar.length /
        (questionsExam?.exams?.questions_exam?.length ?? 0)) *
        100,
    );

    const payload = {
      created_at: new Date().toISOString(),
      student_id: getIdStudent,
      exam_id: Number(idExams),
      answer_student:
        questionsExam?.tipe_ujian === "pg" ? clickedAnswerPg : answerEssayExams,
      hasil_ujian: questionsExam?.tipe_ujian === "pg" ? resultExam : "pending",
      status_exam: true,
      kelas: dataStudent?.classes,
    };

    const response = await fetch("/api/examDone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    if (res.success) {
      toast("Berhasil ✅", { description: "Ujian Telah Selesai" });
      localStorage.removeItem("timer");
      localStorage.removeItem("exam-answer-pg");
      localStorage.removeItem("exam-answer-essay");
      localStorage.removeItem("markQuestions");
      localStorage.removeItem("random-number-exam");
      router.push("/Student/Dashboard");
    } else {
      toast("❌ Gagal", { description: "Gagal menyimpan data hasil ujian" });
    }
  }

  useEffect(() => {
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    document.body.classList.add("no-select");

    return () => {
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.body.classList.remove("no-select");
    };
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      toast("❌ Tidak Bisa Kembali", {
        description: "Tombol dinonaktifkan selama ujian!",
      });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleOutsideContent = (e: MouseEvent) => {
      const refs = [
        clickedOutsideCheked.current,
        handleClickedOutsideContent.current,
        clickedMarkQuestions.current,
        clickedAnswerQuestions.current,
      ];
      const isOutside = refs.every(
        (ref) => ref && !ref.contains(e.target as Node),
      );
      if (isOutside) {
        setIsClosedContent(true);
      }
    };

    window.addEventListener("click", handleOutsideContent);
    return () => window.removeEventListener("click", handleOutsideContent);
  }, []);

  useEffect(() => {
    if (isClosedContent) {
      setShowInformationExam(false);
      setIsClosedContent(false);
    }
  }, [isClosedContent]);

  return (
    <MainContent>
      {questionsExam ? (
        <div className="min-h-screen bg-slate-100">
          {/* ================= MOBILE OVERLAY ================= */}
          {isSizeMobile && showInformationExam && (
            <button
              type="button"
              aria-label="Tutup navigasi soal"
              onClick={() => {
                setShowInformationExam(false);
                setIsClosedContent(true);
              }}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] md:hidden"
            />
          )}

          <div className="flex min-h-screen">
            {/* ================= SIDEBAR ================= */}
            <div className="min-h-screen">
              {/* Overlay mobile */}
              {isSizeMobile && showInformationExam && (
                <button
                  type="button"
                  aria-label="Tutup navigasi soal"
                  onClick={() => {
                    setShowInformationExam(false);
                    setIsClosedContent(true);
                  }}
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                />
              )}

              {/* Sidebar */}
              <aside
                ref={handleClickedOutsideContent}
                className={`
      fixed inset-y-0 left-0 z-50
      w-[300px] max-w-[85vw]
      bg-slate-950 text-white shadow-2xl
      transition-transform duration-300 ease-out

      ${
        isSizeMobile && !showInformationExam
          ? "-translate-x-full"
          : "translate-x-0"
      }

      lg:translate-x-0
      lg:max-w-none
      lg:shadow-xl
    `}
              >
                <div className="flex h-screen flex-col">
                  {/* Header */}
                  <div className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-5 sm:py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300 sm:text-xs">
                          Exam Session
                        </p>

                        <h2 className="mt-1 truncate text-lg font-bold sm:text-xl">
                          Navigasi Soal
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowInformationExam(false);
                          setIsClosedContent(true);
                        }}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 lg:hidden"
                      >
                        <X className="size-5" />
                      </button>
                    </div>

                    {/* Timer */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="min-w-0 rounded-xl bg-white/5 p-3">
                        <p className="text-[11px] text-slate-400">Tipe Ujian</p>

                        <p className="mt-1 truncate text-sm font-semibold">
                          {questionsExam?.tipe_ujian === "pg"
                            ? "Pilihan Ganda"
                            : "Essay"}
                        </p>
                      </div>

                      {formatedTime !== "NaN:NaN" && (
                        <div
                          className={`
                flex min-h-[58px] items-center justify-center gap-2
                rounded-xl px-2
                ${
                  minute === 0 && second <= 20
                    ? "animate-pulse bg-red-500"
                    : "bg-emerald-500"
                }
              `}
                        >
                          <Timer className="size-5 shrink-0" />

                          <span className="truncate font-mono text-sm font-bold tabular-nums">
                            {formatedTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-300">
                        Daftar Soal
                      </h3>

                      <span className="text-xs text-slate-500">
                        {dataUjianRandom.length} soal
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                      {dataUjianRandom.map((item: any, i: number) => {
                        const isAnswerPg = clickedAnswerPg[item.id];
                        const isAnswerEssay = answerEssayExams[item.id];
                        const isMarking = markQuestions[item.id];

                        const isAnswered =
                          questionsExam?.tipe_ujian === "pg"
                            ? Boolean(isAnswerPg)
                            : Boolean(isAnswerEssay);

                        return (
                          <button
                            type="button"
                            key={item.id ?? i}
                            className={`relative aspect-square min-w-0 rounded-lg text-xs font-bold sm:rounded-xl sm:text-sm ${
                              isAnswered
                                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                                : "bg-white/10 text-slate-300 hover:bg-white/20"
                            }`}
                          >
                            {isMarking &&
                              ((questionsExam?.tipe_ujian === "pg" &&
                                !isAnswerPg) ||
                                (questionsExam?.tipe_ujian === "essay" &&
                                  !isAnswerEssay)) && (
                                <Flag className="absolute left-1 top-1 size-2.5 text-amber-300 sm:size-3" />
                              )}

                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="shrink-0 border-t border-white/10 p-4 sm:p-5">
                    <div className="rounded-xl bg-white/5 p-3 sm:rounded-2xl sm:p-4">
                      <p className="text-[11px] leading-5 text-slate-400 sm:text-xs">
                        Pastikan seluruh jawaban telah diperiksa sebelum
                        mengakhiri ujian.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main */}
              <main className="min-h-screen min-w-0 ml-0 lg:ml-[240px]">
                <div className="mx-auto w-full max-w-5xl p-0 sm:p-5 lg:p-8">
                  {/* content */}
                </div>
              </main>
            </div>

            {/* ================= MAIN CONTENT ================= */}
            <main className="min-w-0 flex-1">
              <div className="mx-auto w-full max-w-6xl p-3 sm:p-5 lg:p-8">
                {/* Exam Header */}
                <section className="sticky top-0 z-30 mb-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-xl sm:mb-5 sm:rounded-2xl sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600 sm:text-xs">
                        Ujian Aktif
                      </p>

                      <h1 className="mt-1 truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                        {questionsExam.exams.nama_ujian}
                      </h1>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex shrink-0 items-center gap-2 md:hidden">
                      {formatedTime !== "NaN:NaN" && (
                        <div
                          className={`
                    flex items-center gap-1.5 rounded-lg px-2.5 py-2
                    font-mono text-xs font-bold tabular-nums
                    sm:gap-2 sm:rounded-xl sm:px-3 sm:text-sm
                    ${
                      minute === 0 && second <= 20
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }
                  `}
                        >
                          <Timer className="size-4 sm:size-5" />
                          <span>{formatedTime}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setShowInformationExam(true);
                          setIsClosedContent(false);
                        }}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white sm:size-10 sm:rounded-xl"
                        aria-label="Buka navigasi soal"
                      >
                        <List className="size-4 sm:size-5" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* ================= QUESTIONS ================= */}
                <div className="space-y-4 sm:space-y-5">
                  {dataUjianRandom.map((item: any, i: number) => (
                    <section
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 lg:p-7"
                    >
                      {/* Question Header */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-extrabold text-white sm:size-10 sm:rounded-xl sm:text-sm">
                          {String(i + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                            Pertanyaan {i + 1}
                          </p>

                          <h2 className="mt-1 break-words text-base font-bold leading-6 text-slate-900 sm:text-lg sm:leading-7 lg:text-xl">
                            {item.questions}
                          </h2>
                        </div>
                      </div>

                      {/* PG */}
                      {questionsExam?.tipe_ujian === "pg" ? (
                        <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                          {["a", "b", "c", "d", "e"].map((opt) => {
                            const answerKey = `answer_${opt}`;
                            const answerText = item.answerPg[answerKey];

                            const isSelected =
                              clickedAnswerPg[item.id] === answerText;

                            return (
                              <label
                                key={opt}
                                className={`
                          flex cursor-pointer items-start
                          gap-2.5 rounded-xl border p-3
                          transition-all sm:gap-3 sm:p-4
                          ${
                            isSelected
                              ? "border-blue-300 bg-blue-50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                          }
                        `}
                              >
                                <Input
                                  type="radio"
                                  name={item.id}
                                  className="mt-0.5 size-4 shrink-0 cursor-pointer accent-blue-600 sm:size-5"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleSelectedAnswer(item.id, answerText);
                                    }
                                  }}
                                  ref={clickedAnswerQuestions}
                                />

                                <span
                                  className={`
                            flex size-7 shrink-0 items-center
                            justify-center rounded-lg text-[11px]
                            font-bold sm:size-8 sm:text-xs
                            ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                                >
                                  {opt.toUpperCase()}
                                </span>

                                <span className="min-w-0 flex-1 break-words text-sm font-medium leading-6 text-slate-700 sm:text-base">
                                  {answerText}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        /* Essay */
                        <div className="mt-5 sm:mt-6">
                          <label
                            htmlFor={item.id}
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Jawaban Anda
                          </label>

                          <Textarea
                            id={item.id}
                            placeholder="Tuliskan jawaban Anda di sini..."
                            className="min-h-32 w-full resize-y rounded-xl border-slate-200 bg-slate-50 p-3 text-sm leading-6 focus:bg-white sm:min-h-36 sm:p-4"
                            onCopy={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onChange={(e) =>
                              setAnswerEssayExams((prev: any) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            value={answerEssayExams[item.id] || ""}
                          />
                        </div>
                      )}

                      {/* Mark */}
                      <div className="mt-4 flex justify-end sm:mt-5">
                        <Button
                          type="button"
                          variant="outline"
                          className={`
                    h-9 rounded-lg px-3 text-xs sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm
                    ${
                      markQuestions[item.id]
                        ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                        : "border-slate-200"
                    }
                  `}
                          onClick={(e) => {
                            e.stopPropagation();

                            setMarkQuestions((prev: any) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }));
                          }}
                          ref={clickedMarkQuestions}
                        >
                          <Flag className="mr-1.5 size-3.5 sm:mr-2 sm:size-4" />

                          {markQuestions[item.id]
                            ? "Batal Tandai"
                            : "Tandai Soal"}
                        </Button>
                      </div>
                    </section>
                  ))}
                </div>

                {/* ================= SUBMIT ================= */}
                <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:rounded-2xl sm:p-5 lg:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                        Sudah selesai mengerjakan?
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                        Pastikan jawaban sudah diperiksa sebelum mengakhiri
                        ujian.
                      </p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 sm:w-auto">
                          Selesai Ujian
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
                        <DialogHeader>
                          {handleAnswerEmpty() === false ? (
                            <>
                              <DialogTitle className="text-lg font-bold sm:text-xl">
                                Jawaban Belum Lengkap
                              </DialogTitle>

                              <DialogDescription className="pt-2 text-sm leading-6">
                                Masih terdapat jawaban yang belum diisi. Apakah
                                Anda yakin ingin mengakhiri sesi ujian ini?
                              </DialogDescription>
                            </>
                          ) : (
                            <>
                              <DialogTitle className="text-lg font-bold sm:text-xl">
                                Konfirmasi Ujian
                              </DialogTitle>

                              <DialogDescription className="pt-2 text-sm leading-6">
                                Apakah Anda yakin ingin menyelesaikan ujian ini?
                              </DialogDescription>
                            </>
                          )}
                        </DialogHeader>

                        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="w-full rounded-xl sm:w-auto"
                            >
                              Kembali
                            </Button>
                          </DialogClose>

                          <DialogClose asChild>
                            <Button
                              onClick={handleSendExam}
                              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"
                            >
                              Akhiri Ujian
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </section>
              </div>
            </main>
          </div>

          {/* ================= TIMEOUT ================= */}
          <AlertDialog open={timeOutDone} onOpenChange={setTimeOutDone}>
            <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold sm:text-xl">
                  Waktu Telah Habis
                </AlertDialogTitle>

                <AlertDialogDescription className="text-sm leading-6">
                  Ujian telah mencapai batas waktu yang telah ditentukan.
                  Jawaban Anda akan disimpan secara otomatis.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"
                  onClick={handleSendExam}
                >
                  Oke
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <>
          {/* ================= EXAM SIDEBAR ================= */}
          <aside className="fixed inset-y-0 left-0 hidden w-[290px] bg-slate-900 md:block">
            <div className="flex h-full flex-col p-5">
              {/* Header */}
              <div className="animate-pulse">
                <div className="h-3 w-28 rounded bg-slate-700" />

                <div className="mt-3 h-7 w-40 rounded-md bg-slate-700" />

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="h-3 w-20 rounded bg-slate-800" />
                    <div className="mt-2 h-4 w-24 rounded bg-slate-700" />
                  </div>

                  <div className="h-10 w-28 rounded-xl bg-slate-700" />
                </div>
              </div>

              {/* Question Navigation */}
              <div className="mt-8">
                <div className="h-4 w-28 rounded bg-slate-700 animate-pulse" />

                <div className="mt-4 grid grid-cols-5 gap-2 animate-pulse">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-white/10"
                    />
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
                <div className="h-3 w-20 rounded bg-slate-700" />

                <div className="mt-4 space-y-3">
                  <div className="h-3 w-28 rounded bg-slate-800" />
                  <div className="h-3 w-32 rounded bg-slate-800" />
                  <div className="h-3 w-24 rounded bg-slate-800" />
                </div>
              </div>
            </div>
          </aside>

          {/* ================= MAIN ================= */}
          <main className="min-h-screen bg-slate-100 md:ml-[290px]">
            <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
              {/* Exam Header */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between animate-pulse">
                  <div className="w-full">
                    <div className="h-3 w-24 rounded bg-slate-200" />

                    <div className="mt-3 h-8 w-72 max-w-full rounded-md bg-slate-200" />
                  </div>

                  <div className="ml-4 hidden h-10 w-28 rounded-xl bg-slate-200 md:block" />
                </div>
              </section>

              {/* Question Cards */}
              <div className="mt-5 space-y-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <section
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                  >
                    {/* Question */}
                    <div className="flex items-start gap-4 animate-pulse">
                      <div className="size-10 shrink-0 rounded-xl bg-slate-200" />

                      <div className="w-full pt-1">
                        <div className="h-3 w-24 rounded bg-slate-100" />

                        <div className="mt-2 h-5 w-full max-w-2xl rounded bg-slate-200" />

                        <div className="mt-2 h-5 w-3/4 max-w-xl rounded bg-slate-100" />
                      </div>
                    </div>

                    {/* Options */}
                    <div className="mt-6 space-y-3 animate-pulse">
                      {[1, 2, 3, 4].map((option) => (
                        <div
                          key={option}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 p-4"
                        >
                          <div className="size-5 rounded-full bg-slate-100" />

                          <div className="size-7 rounded-lg bg-slate-100" />

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

                    {/* Mark Button */}
                    <div className="mt-5 flex justify-end animate-pulse">
                      <div className="h-10 w-32 rounded-xl bg-slate-100" />
                    </div>
                  </section>
                ))}
              </div>

              {/* Submit */}
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                  <div>
                    <div className="h-5 w-44 rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
                  </div>

                  <div className="h-11 w-full rounded-xl bg-slate-200 sm:w-32" />
                </div>
              </section>
            </div>
          </main>
        </>
      )}
    </MainContent>
  );
}
