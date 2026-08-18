"use client";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/data";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import MainContent from "@/layout/mainContent/content";
import { ClipboardList, PenLine, Trash2 } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

const editExamQuestionSchema = z.object({
  id: z.string().min(1),

  pertanyaan: z.string().min(5, "Minimal 5 karakter"),

  pilihanGanda: z
    .object({
      answer_a: z.string(),
      answer_b: z.string(),
      answer_c: z.string(),
      answer_d: z.string(),
      answer_e: z.string(),
    })
    .optional(),

  jawabanYangBenar: z.enum(["a", "b", "c", "d", "e"]).optional(),
});

type Ujian = {
  id: string;
  answerPg: {
    answer_a: string;
    answer_b: string;
    answer_c: string;
    answer_d: string;
    answer_e: string;
  };
  correctAnswer: string;
  questions: string;
};

type DataExam = {
  created_at_exams: string;
  id: number;
  idTeacher: string;
  nama_ujian: string;
  questions_exam: Ujian[];
  tipeUjian: string;
};

type EditExamQuestionSchemaType = z.infer<typeof editExamQuestionSchema>;

export default function ManageExamComponent() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [viewQuestions, setViewQuestions] = useState<DataExam | null>(null);
  const getidTeacher = useGetIdUsers((state) => state.idUser);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({
    editExam: false,
    deleteExam: false,
  });
  const questions = viewQuestions?.questions_exam ?? [];
  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditExamQuestionSchemaType>({
    resolver: zodResolver(editExamQuestionSchema),

    defaultValues: {
      id: "",
      pertanyaan: "",
      pilihanGanda: {
        answer_a: "",
        answer_b: "",
        answer_c: "",
        answer_d: "",
        answer_e: "",
      },
      jawabanYangBenar: undefined,
    },
  });

  async function onSubmit(formData: EditExamQuestionSchemaType) {
    const examId = viewQuestions?.id;

    if (!examId) {
      toast("Gagal ❌", {
        description: "ID ujian tidak ditemukan.",
      });

      return;
    }

    try {
      // ==========================================
      // 1. Ambil data ujian
      // ==========================================

      const { data: examData, error: fetchError } = await supabase
        .from("exams")
        .select("questions_exam, tipeUjian")
        .eq("id", examId)
        .single();

      if (fetchError) {
        console.error("Fetch exam error:", fetchError);

        toast("Gagal ❌", {
          description: "Ujian tidak ditemukan.",
        });

        return;
      }

      // ==========================================
      // 2. Pastikan questions_exam berupa array
      // ==========================================

      const questions = Array.isArray(examData.questions_exam)
        ? examData.questions_exam
        : [];

      // ==========================================
      // 3. Cek apakah soal yang diedit ada
      // ==========================================

      const questionExists = questions.some(
        (question) => question.id === formData.id,
      );

      if (!questionExists) {
        toast("Gagal ❌", {
          description: "Soal yang ingin diedit tidak ditemukan.",
        });

        return;
      }

      // ==========================================
      // 4. Update soal
      // ==========================================

      const updatedQuestions = questions.map((question) => {
        if (question.id !== formData.id) {
          return question;
        }

        if (examData.tipeUjian === "pg") {
          return {
            ...question,
            questions: formData.pertanyaan,
            answerPg: formData.pilihanGanda,
            correctAnswer: formData.jawabanYangBenar,
          };
        }

        return {
          ...question,
          questions: formData.pertanyaan,
        };
      });

      // ==========================================
      // 5. Simpan ke database
      // ==========================================

      const { error: updateError } = await supabase
        .from("exams")
        .update({
          questions_exam: updatedQuestions,
        })
        .eq("id", examId);

      if (updateError) {
        console.error("Update exam error:", updateError);

        toast("Gagal ❌", {
          description: "Soal gagal diedit. Coba periksa kembali.",
        });

        return;
      }

      // ==========================================
      // 6. Berhasil
      // ==========================================

      toast("Berhasil ✅", {
        description: "Soal berhasil diperbarui.",
      });

      setOpenDialog((prev) => ({
        ...prev,
        editExam: false,
      }));
    } catch (error) {
      console.error("Unexpected update error:", error);

      toast("Gagal ❌", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  useEffect(() => {
    if (!getidTeacher) return;
    async function handleViewQuestions() {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("id", Number(id))
        .eq("idTeacher", getidTeacher)
        .single();

      if (error) {
        toast("Gagal ❌", {
          description: "Soal gagal ditampilkan.",
        });
      }
      setViewQuestions(data);
    }
    handleViewQuestions();
  }, [getidTeacher]);

  async function handleDeleteQuestion(questionId: string) {
    try {
      // =========================================
      // 1. Ambil data soal dari exam
      // =========================================

      const { data: exam, error: fetchError } = await supabase
        .from("exams")
        .select("questions_exam")
        .eq("id", viewQuestions?.id)
        .single();

      if (fetchError) {
        console.error("Fetch exam error:", fetchError);

        toast("Gagal ❌", {
          description: "Data ujian gagal diambil.",
        });

        return;
      }

      // =========================================
      // 2. Pastikan questions_exam berupa array
      // =========================================

      const questions = Array.isArray(exam?.questions_exam)
        ? exam.questions_exam
        : [];

      // =========================================
      // 3. Hapus soal berdasarkan ID soal
      // =========================================

      const updatedQuestions = questions.filter(
        (question: { id: string }) => question.id !== questionId,
      );

      // =========================================
      // 4. Pastikan soal memang ditemukan
      // =========================================

      if (updatedQuestions.length === questions.length) {
        toast("Gagal ❌", {
          description: "Soal yang ingin dihapus tidak ditemukan.",
        });

        return;
      }

      // =========================================
      // 5. Update kembali questions_exam
      // =========================================

      const { error: updateError } = await supabase
        .from("exams")
        .update({
          questions_exam: updatedQuestions,
        })
        .eq("id", viewQuestions?.id);

      if (updateError) {
        console.error("Update exam error:", updateError);

        toast("Gagal ❌", {
          description: "Soal gagal dihapus.",
        });

        return;
      }

      // =========================================
      // 6. Berhasil
      // =========================================

      toast("Berhasil ✅", {
        description: "Soal berhasil dihapus.",
      });
    } catch (error) {
      console.error("Delete question error:", error);

      toast("Gagal ❌", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  function getDataBeforeUpdate(isTypeExam: "pg" | "essay", dataQuestion: any) {
    setSelectedQuestion(dataQuestion);

    const baseData = {
      id: dataQuestion.id ?? "",
      pertanyaan: dataQuestion.questions ?? "",
    };

    if (isTypeExam === "pg") {
      reset({
        ...baseData,

        pilihanGanda: {
          answer_a: dataQuestion.answerPg?.answer_a ?? "",
          answer_b: dataQuestion.answerPg?.answer_b ?? "",
          answer_c: dataQuestion.answerPg?.answer_c ?? "",
          answer_d: dataQuestion.answerPg?.answer_d ?? "",
          answer_e: dataQuestion.answerPg?.answer_e ?? "",
        },

        jawabanYangBenar: dataQuestion.correctAnswer ?? "",
      });
    } else {
      reset({
        ...baseData,

        pilihanGanda: undefined,
        jawabanYangBenar: undefined,
      });
    }

    setOpenDialog((prev) => ({
      ...prev,
      editExam: true,
    }));
  }

  function getDataBeforeDelete(idExam: string) {
    setSelectedQuestion(idExam);
    setOpenDialog((prev) => ({
      ...prev,
      deleteExam: true,
    }));
  }

  return (
    <MainContent>
      {Object.values(viewQuestions ?? {}).length > 0 ? (
        <div className="space-y-6">
          {/* ================= HEADER ================= */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-100 sm:p-8">
            <div className="relative">
              <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />

              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100 sm:text-sm">
                  Exam Management
                </p>

                <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Kelola Soal Ujian
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold sm:text-lg">
                    {viewQuestions?.nama_ujian}
                  </span>

                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                    {viewQuestions?.tipeUjian === "pg"
                      ? "Pilihan Ganda"
                      : "Essay"}
                  </span>

                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    {viewQuestions?.questions_exam?.length || 0} Soal
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= QUESTIONS ================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Section Header */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Daftar Soal
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Kelola pertanyaan dan jawaban yang terdapat pada ujian ini.
                </p>
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

                    <TableHead className="min-w-[450px] font-semibold text-slate-600">
                      Soal Ujian
                    </TableHead>

                    <TableHead className="min-w-[70px] text-center font-semibold text-slate-600">
                      Kelola
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {questions.length > 0 ? (
                    questions.map((data: any, i: number) => (
                      <TableRow
                        key={data.id ?? i}
                        className="align-top transition-colors hover:bg-slate-50"
                      >
                        {/* Number */}
                        <TableCell className="pt-5 font-bold text-slate-400">
                          {String(i + 1).padStart(2, "0")}
                        </TableCell>

                        {/* Question */}
                        <TableCell className="pt-5">
                          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-base font-semibold leading-6 text-slate-900">
                              {data.questions}
                            </p>

                            {/* Multiple Choice */}
                            {viewQuestions?.tipeUjian === "pg" && (
                              <div className="mt-4 space-y-2">
                                {["a", "b", "c", "d", "e"].map((option) => {
                                  const answerKey = `answer_${option}`;
                                  const answerText = data.answerPg?.[answerKey];

                                  const isCorrect =
                                    data.correctAnswer === answerText;

                                  return (
                                    <div
                                      key={option}
                                      className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
                                        isCorrect
                                          ? "border-emerald-200 bg-emerald-50"
                                          : "border-slate-100 bg-white"
                                      }`}
                                    >
                                      <span
                                        className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                                          isCorrect
                                            ? "bg-emerald-500 text-white"
                                            : "bg-slate-100 text-slate-500"
                                        }`}
                                      >
                                        {option.toUpperCase()}
                                      </span>

                                      <span
                                        className={`min-w-0 break-words text-sm leading-6 ${
                                          isCorrect
                                            ? "font-semibold text-emerald-700"
                                            : "text-slate-600"
                                        }`}
                                      >
                                        {answerText}
                                      </span>

                                      {isCorrect && (
                                        <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                          Benar
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Essay */}
                            {viewQuestions?.tipeUjian === "essay" && (
                              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                  Tipe Jawaban
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-600">
                                  Peserta memberikan jawaban dalam bentuk essay.
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex flex-col gap-3">
                            {/* Edit */}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                getDataBeforeUpdate(
                                  viewQuestions?.tipeUjian as "pg" | "essay",
                                  data,
                                )
                              }
                            >
                              <PenLine className="size-5" />
                            </Button>

                            {/* Delete */}
                            <Button
                              type="button"
                              onClick={() => getDataBeforeDelete(data.id)}
                              variant="destructive"
                              className="h-10 w-full rounded-xl border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700"
                            >
                              <Trash2 className="size-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <ClipboardList className="size-9 text-slate-300" />

                          <p className="mt-3 font-semibold text-slate-500">
                            Belum Ada Soal
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            Soal untuk ujian ini belum dibuat.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ================= MANAGE EXAM ================= */}
            {/* edit exam */}
            <Dialog
              open={openDialog.editExam}
              onOpenChange={(open) =>
                setOpenDialog((prev) => ({
                  ...prev,
                  editExam: open,
                }))
              }
            >
              <form
                className="space-y-5"
                onSubmit={handleSubmit(onSubmit)}
                id="form-edit-question"
              >
                <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Edit Soal
                    </DialogTitle>

                    <DialogDescription>
                      Perbarui pertanyaan dan jawaban soal berikut.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Question */}
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor={`question-${selectedQuestion?.id}`}
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Pertanyaan
                      </label>

                      <Textarea
                        id={`question-${selectedQuestion?.id}`}
                        {...register("pertanyaan")}
                        className="h-24 rounded-xl border-slate-200"
                      />

                      {errors.pertanyaan && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.pertanyaan.message}
                        </p>
                      )}
                    </div>

                    {/* PG */}
                    {viewQuestions?.tipeUjian === "pg" && (
                      <>
                        <div>
                          <h3 className="mb-3 text-sm font-semibold text-slate-700">
                            Pilihan Jawaban
                          </h3>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {(["a", "b", "c", "d", "e"] as const).map(
                              (option) => {
                                const answerKey =
                                  `answer_${option.toUpperCase()}` as
                                    | "answer_a"
                                    | "answer_b"
                                    | "answer_c"
                                    | "answer_d"
                                    | "answer_e";

                                return (
                                  <div key={option}>
                                    <label
                                      htmlFor={`${answerKey}-${selectedQuestion?.id}`}
                                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                    >
                                      Opsi {option.toUpperCase()}
                                    </label>

                                    <Input
                                      id={`${answerKey}-${selectedQuestion?.id}`}
                                      className="h-10 rounded-xl border-slate-200"
                                      {...register(`pilihanGanda.${answerKey}`)}
                                    />

                                    {errors.pilihanGanda?.[answerKey] && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {
                                          errors.pilihanGanda[answerKey]
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Jawaban Benar
                          </label>

                          <Controller
                            control={control}
                            name="jawabanYangBenar"
                            render={({ field, fieldState }) => (
                              <>
                                <Select
                                  value={field.value ?? ""}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 shadow-none">
                                    <SelectValue placeholder="Pilih jawaban yang benar" />
                                  </SelectTrigger>

                                  <SelectContent className="rounded-xl bg-white">
                                    {(["a", "b", "c", "d", "e"] as const).map(
                                      (option) => {
                                        const answerKey =
                                          `answer_${option.toUpperCase()}` as
                                            | "answer_a"
                                            | "answer_b"
                                            | "answer_c"
                                            | "answer_d"
                                            | "answer_e";

                                        const answerText =
                                          watch(`pilihanGanda.${answerKey}`) ??
                                          "";

                                        if (!answerText.trim()) return null;

                                        return (
                                          <SelectItem
                                            key={option}
                                            value={answerText}
                                          >
                                            Opsi {option.toUpperCase()} —{" "}
                                            {answerText}
                                          </SelectItem>
                                        );
                                      },
                                    )}
                                  </SelectContent>
                                </Select>

                                {fieldState.error && (
                                  <p className="mt-0.5 text-xs text-red-500">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <DialogFooter className="mt-5 gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" className="rounded-xl">
                        Batal
                      </Button>
                    </DialogClose>

                    <Button
                      type="submit"
                      form="form-edit-question"
                      className="rounded-xl bg-blue-600 hover:bg-blue-700"
                    >
                      Simpan Perubahan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>

            {/* delete exam */}
            <Dialog
              open={openDialog.deleteExam}
              onOpenChange={(open) =>
                setOpenDialog((prev) => ({
                  ...prev,
                  deleteExam: open,
                }))
              }
            >
              <DialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Hapus Soal
                  </DialogTitle>

                  <DialogDescription className="pt-2 leading-6">
                    Apakah Anda yakin ingin menghapus soal ini ?
                    <span className="mt-2 block">
                      Tindakan ini tidak dapat dibatalkan.
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-xl">
                      Batal
                    </Button>
                  </DialogClose>

                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      className="rounded-xl bg-red-600 hover:bg-red-700"
                      onClick={() => handleDeleteQuestion(selectedQuestion)}
                    >
                      Hapus Soal
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Legend */}
            {viewQuestions?.tipeUjian === "pg" && (
              <div className="border-t border-slate-200 bg-emerald-50/50 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <span className="size-3 rounded bg-emerald-500" />
                  Pilihan yang diberi highlight hijau merupakan jawaban yang
                  benar.
                </div>
              </div>
            )}

            {/* Back */}
            <div className="border-t border-slate-200 px-5 py-5 sm:px-6">
              <Link
                href="/Teacher/dashboard"
                className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </section>
        </div>
      ) : (
        <>
          {/* ================= HEADER ================= */}
          <section className="overflow-hidden rounded-3xl bg-slate-200 p-6 shadow-sm animate-pulse sm:p-8">
            <div className="h-3 w-28 rounded bg-slate-300" />

            <div className="mt-3 h-9 w-56 max-w-full rounded-md bg-slate-300" />

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="h-7 w-52 rounded-full bg-slate-300" />
              <div className="h-7 w-28 rounded-full bg-slate-300" />
              <div className="h-7 w-20 rounded-full bg-slate-300" />
            </div>
          </section>

          {/* ================= QUESTIONS ================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="animate-pulse">
                <div className="h-6 w-40 rounded-md bg-slate-200" />

                <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px] animate-pulse">
                {/* Header */}
                <div className="grid grid-cols-[60px_1fr_170px] gap-5 bg-slate-50 px-5 py-4">
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                </div>

                {/* Rows */}
                {[1, 2, 3, 4, 5].map((row) => (
                  <div
                    key={row}
                    className="grid grid-cols-[60px_1fr_170px] gap-5 border-t border-slate-100 px-5 py-5"
                  >
                    {/* Number */}
                    <div className="h-4 w-6 rounded bg-slate-100" />

                    {/* Question */}
                    <div>
                      <div className="h-5 w-full max-w-xl rounded bg-slate-200" />

                      <div className="mt-3 space-y-2">
                        <div className="h-8 w-3/4 max-w-md rounded-lg bg-slate-100" />
                        <div className="h-8 w-2/3 max-w-sm rounded-lg bg-slate-100" />
                        <div className="h-8 w-4/5 max-w-lg rounded-lg bg-slate-100" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <div className="h-10 w-full rounded-xl bg-slate-100" />
                      <div className="h-10 w-full rounded-xl bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="border-t border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2 animate-pulse">
                <div className="size-3 rounded bg-slate-200" />
                <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
              </div>
            </div>

            {/* Back */}
            <div className="border-t border-slate-200 px-5 py-5 sm:px-6">
              <div className="h-11 w-40 rounded-xl bg-slate-200 animate-pulse" />
            </div>
          </section>
        </>
      )}
    </MainContent>
  );
}
