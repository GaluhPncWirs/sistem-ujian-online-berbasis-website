import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useRandomId } from "@/app/hooks/getRandomId";
import { useManageExamsData } from "@/app/hooks/getDataManageExams";
import { Textarea } from "@/components/ui/textarea";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const createExamSchema = z
  .object({
    typeUjian: z.string().min(1, "Pilih salah satu"),

    namaUjian: z.string().min(1, "Pilih salah satu"),

    namaUjianBaru: z
      .string()
      .min(5, "Minimal 5 karakter")
      .optional()
      .or(z.literal("")),

    pertanyaan: z.string().min(5, "Minimal 5 karakter"),

    pilihanGanda: z
      .object({
        opsiA: z.string(),
        opsiB: z.string(),
        opsiC: z.string(),
        opsiD: z.string(),
        opsiE: z.string(),
      })
      .optional(),

    jawabanYangBenar: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // ==========================================
    // Nama ujian baru
    // ==========================================

    if (
      data.namaUjian === "buatUjianBaru" &&
      (!data.namaUjianBaru || data.namaUjianBaru.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["namaUjianBaru"],
        message: "Nama ujian baru harus diisi",
      });
    }

    // ==========================================
    // Pertanyaan
    // ==========================================

    if (!data.pertanyaan || data.pertanyaan.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pertanyaan"],
        message: "Pertanyaan harus diisi",
      });
    }

    // ==========================================
    // Pilihan Ganda
    // ==========================================

    if (data.typeUjian === "pg") {
      const pilihan = data.pilihanGanda;

      if (!pilihan) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pilihanGanda"],
          message: "Semua opsi jawaban harus diisi",
        });
      } else {
        const opsi = [
          ["opsiA", pilihan.opsiA],
          ["opsiB", pilihan.opsiB],
          ["opsiC", pilihan.opsiC],
          ["opsiD", pilihan.opsiD],
          ["opsiE", pilihan.opsiE],
        ] as const;

        opsi.forEach(([field, value]) => {
          if (!value || value.trim().length < 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["pilihanGanda", field],
              message: "Minimal 3 karakter",
            });
          }
        });
      }

      if (!data.jawabanYangBenar || data.jawabanYangBenar.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jawabanYangBenar"],
          message: "Pilih jawaban yang benar",
        });
      }
    }
  });

type CreateExamSchemaType = z.infer<typeof createExamSchema>;

const examOptions = ["a", "b", "c", "d", "e"] as const;
type ExamOption = (typeof examOptions)[number];

export default function CreateNewQuestions() {
  const idTeacher = useGetIdUsers((state) => state.idUser);
  const dataNameExam = useManageExamsData(idTeacher);
  const [openDialog, setOpenDialog] = useState(false);
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateExamSchemaType>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      typeUjian: "",
      namaUjian: "",
      namaUjianBaru: "",
      pertanyaan: "",

      // pilihan ganda
      pilihanGanda: {
        opsiA: "",
        opsiB: "",
        opsiC: "",
        opsiD: "",
        opsiE: "",
      },
      jawabanYangBenar: "",
    },
  });

  const isNewNameExam = watch("namaUjian");
  const isTypeExam = watch("typeUjian");
  const selectedValueNameExam = watch("namaUjian");

  const answer: Record<
    "answer_a" | "answer_b" | "answer_c" | "answer_d" | "answer_e",
    string
  > = {
    answer_a: watch("pilihanGanda.opsiA") ?? "",
    answer_b: watch("pilihanGanda.opsiB") ?? "",
    answer_c: watch("pilihanGanda.opsiC") ?? "",
    answer_d: watch("pilihanGanda.opsiD") ?? "",
    answer_e: watch("pilihanGanda.opsiE") ?? "",
  };
  const selectCorrectAnswer = watch("jawabanYangBenar");

  async function onSubmit(dataNewExam: CreateExamSchemaType) {
    const isNewExam = selectedValueNameExam === "buatUjianBaru";
    const isMultipleChoice = isTypeExam === "pg";

    try {
      // =========================================================
      // 1. Jika membuat ujian baru, cek nama ujian terlebih dahulu
      // =========================================================

      if (isNewExam) {
        const { data: existingExam, error: checkError } = await supabase
          .from("exams")
          .select("id")
          .eq("nama_ujian", dataNewExam.namaUjianBaru)
          .eq("idTeacher", idTeacher)
          .maybeSingle();

        if (checkError) {
          console.error("Check exam error:", checkError);

          toast("Gagal ❌", {
            description: "Gagal memeriksa nama ujian.",
          });

          return;
        }

        if (existingExam) {
          toast("Gagal ❌", {
            description: "Nama ujian tersebut sudah pernah dibuat.",
          });

          return;
        }

        // =======================================================
        // 2. Buat question pertama
        // =======================================================

        const question = isMultipleChoice
          ? {
              id: useRandomId(7, "EX"),
              questions: dataNewExam.pertanyaan,
              answerPg: dataNewExam.pilihanGanda,
              correctAnswer: dataNewExam.jawabanYangBenar,
            }
          : {
              id: useRandomId(7, "EX"),
              questions: dataNewExam.pertanyaan,
            };

        const { error: insertError } = await supabase.from("exams").insert({
          created_at_exams: new Date().toISOString(),
          nama_ujian: dataNewExam.namaUjianBaru,
          questions_exam: [question],
          idTeacher,
          tipeUjian: dataNewExam.typeUjian,
        });

        if (insertError) {
          console.error("Insert exam error:", insertError);

          toast("Gagal ❌", {
            description: "Ujian gagal ditambahkan. Periksa kembali data ujian.",
          });

          return;
        }

        toast("Berhasil ✅", {
          description: isMultipleChoice
            ? "Soal pilihan ganda berhasil ditambahkan."
            : "Soal essay berhasil ditambahkan.",
        });

        setOpenDialog(false);
        return;
      }

      // =========================================================
      // 3. Tambahkan soal ke ujian yang sudah ada
      // =========================================================

      const { data: exam, error: examError } = await supabase
        .from("exams")
        .select("id, questions_exam, idTeacher")
        .eq("nama_ujian", selectedValueNameExam)
        .eq("idTeacher", idTeacher)
        .maybeSingle();

      if (examError) {
        console.error("Get exam error:", examError);

        toast("Gagal ❌", {
          description: "Gagal mengambil data ujian.",
        });

        return;
      }

      if (!exam) {
        toast("Gagal ❌", {
          description: "Ujian tidak ditemukan.",
        });

        return;
      }

      // =========================================================
      // 4. Buat question baru
      // =========================================================

      const newQuestion = isMultipleChoice
        ? {
            id: useRandomId(7, "EX"),
            questions: dataNewExam.pertanyaan,
            answerPg: dataNewExam.pilihanGanda,
            correctAnswer: dataNewExam.jawabanYangBenar,
          }
        : {
            id: useRandomId(7, "EX"),
            questions: dataNewExam.pertanyaan,
          };

      const currentQuestions = Array.isArray(exam.questions_exam)
        ? exam.questions_exam
        : [];

      const updatedQuestions = [...currentQuestions, newQuestion];

      // =========================================================
      // 5. Update questions
      // =========================================================

      const { error: updateError } = await supabase
        .from("exams")
        .update({
          questions_exam: updatedQuestions,
        })
        .eq("id", exam.id)
        .eq("idTeacher", idTeacher);

      if (updateError) {
        console.error("Update exam error:", updateError);

        toast("Gagal ❌", {
          description: "Soal gagal ditambahkan. Periksa kembali data soal.",
        });

        return;
      }

      toast("Berhasil ✅", {
        description: "Soal berhasil ditambahkan.",
      });

      setOpenDialog(false);
    } catch (error) {
      console.error("Unexpected error:", error);

      toast("Gagal ❌", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Question Builder
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Buat Soal Ujian
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Buat pertanyaan baru untuk ujian yang sudah tersedia atau buat ujian
            baru sebelum menambahkan soal.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <form
          className="space-y-8"
          onSubmit={handleSubmit(onSubmit)}
          id="create-exam-form"
        >
          {/* ================= EXAM SETTINGS ================= */}
          <section>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Pengaturan Ujian
              </h3>

              <p className="text-sm text-slate-500">
                Tentukan tipe dan ujian yang akan digunakan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Exam Type */}
              <div>
                <label
                  htmlFor="exam-type"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tipe Ujian
                </label>

                <Controller
                  control={control}
                  name="typeUjian"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="exam-type"
                        className="h-12 rounded-xl w-full border-slate-200 bg-slate-50 px-4 shadow-none"
                      >
                        <SelectValue placeholder="Pilih tipe ujian" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl bg-white">
                        <SelectItem value="pg">Pilihan Ganda</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.typeUjian && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.typeUjian?.message}
                  </p>
                )}
              </div>

              {/* Exam Name */}
              <div>
                <label
                  htmlFor="exam-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nama Ujian
                </label>

                <Controller
                  control={control}
                  name="namaUjian"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="exam-name"
                        className="h-12 rounded-xl w-full border-slate-200 bg-slate-50 px-4 shadow-none"
                      >
                        <SelectValue placeholder="Pilih nama ujian" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl bg-white p-1">
                        <SelectItem
                          value="buatUjianBaru"
                          className="rounded-lg bg-blue-50 font-semibold text-blue-600"
                        >
                          + Buat Ujian Baru
                        </SelectItem>

                        {dataNameExam.map((nameExam: any, i: number) => {
                          const isCorrectType =
                            nameExam.tipeUjian === isTypeExam;

                          return (
                            isCorrectType && (
                              <SelectItem
                                key={i}
                                value={nameExam.nama_ujian || "Nama ujian"}
                              >
                                {nameExam.nama_ujian || "Nama Ujian"}
                              </SelectItem>
                            )
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.namaUjian && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.namaUjian?.message}
                  </p>
                )}
              </div>
            </div>

            {/* New Exam Name */}
            {isNewNameExam === "buatUjianBaru" && (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <label
                  htmlFor="nama_ujian"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nama Ujian Baru
                </label>

                <Input
                  id="nama_ujian"
                  {...register("namaUjianBaru")}
                  className="h-12 rounded-xl border-slate-200 bg-white"
                  placeholder="Contoh: Ujian Matematika Semester 1"
                />
                {errors.namaUjianBaru && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.namaUjianBaru?.message}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* ================= QUESTION ================= */}
          <section className="border-t border-slate-100">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">Pertanyaan</h3>

              <p className="text-sm text-slate-500">
                Tulis pertanyaan yang akan diberikan kepada peserta.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <label
                htmlFor="questions"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Isi Pertanyaan
              </label>

              <Textarea
                id="questions"
                {...register("pertanyaan")}
                placeholder="Tulis pertanyaan ujian di sini..."
                className="min-h-32 resize-y rounded-xl border-slate-200 bg-white p-4 text-sm leading-6"
              />
              {errors.pertanyaan && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.pertanyaan?.message}
                </p>
              )}
            </div>
          </section>

          {/* ================= MULTIPLE CHOICE ================= */}
          {isTypeExam === "pg" && (
            <section className="border-t border-slate-100 pt-8">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Pilihan Jawaban
                </h3>

                <p className="text-sm text-slate-500">
                  Isi setiap opsi jawaban, kemudian tentukan jawaban yang benar.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {examOptions.map((option: ExamOption) => {
                  const answerKey = `answer_${option}` as keyof typeof answer;
                  const optionKey = `opsi${option.toUpperCase()}` as
                    | "opsiA"
                    | "opsiB"
                    | "opsiC"
                    | "opsiD"
                    | "opsiE";
                  const optionField = `pilihanGanda.${optionKey}` as const;
                  const optionError =
                    errors.pilihanGanda?.[
                      optionKey as keyof typeof errors.pilihanGanda
                    ];
                  const optionErrorMessage =
                    typeof optionError === "object" && optionError !== null
                      ? "message" in optionError && optionError.message
                      : undefined;

                  return (
                    <div
                      key={`answer-option-${option}`}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <label
                        htmlFor={answerKey}
                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                      >
                        <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold uppercase text-blue-600">
                          {option}
                        </span>
                        Opsi {option.toUpperCase()}
                      </label>

                      <Input
                        id={answerKey}
                        type="text"
                        {...register(optionField)}
                        placeholder={`Masukkan opsi ${option.toUpperCase()}`}
                        className="h-11 rounded-xl border-slate-200"
                      />
                      {optionErrorMessage && (
                        <p className="text-red-500 text-xs mt-0.5">
                          {optionErrorMessage}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Correct Answer */}
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-100/50 p-5">
                <label
                  htmlFor="correct-answer"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Jawaban yang Benar
                </label>

                <Controller
                  control={control}
                  name="jawabanYangBenar"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="correct-answer"
                        className="h-12 w-full rounded-xl border-slate-200 bg-white sm:w-1/2"
                      >
                        <SelectValue placeholder="Pilih jawaban yang benar" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl bg-white">
                        {examOptions.map((option: ExamOption) => {
                          const answerKey =
                            `answer_${option}` as keyof typeof answer;

                          return (
                            <SelectItem key={option} value={option}>
                              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold uppercase text-blue-600">
                                {option}
                              </span>
                              {answer[answerKey] ||
                                `Opsi ${option.toUpperCase()}`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.jawabanYangBenar && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.jawabanYangBenar?.message}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ================= ACTION ================= */}
          <div className="flex flex-col gap-3 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">
              Pastikan seluruh informasi soal sudah benar sebelum disimpan.
            </p>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="w-full rounded-xl bg-blue-600 px-7 py-3 font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Buat Soal
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Periksa Soal
                  </DialogTitle>

                  <DialogDescription className="pt-2 leading-6">
                    Pastikan pertanyaan dan jawaban sudah benar sebelum
                    menambahkan soal.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  {/* Question Preview */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Pertanyaan
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                      {isNewNameExam === "buatUjianBaru"
                        ? isNewNameExam
                        : selectedValueNameExam}
                    </p>
                  </div>

                  {/* Multiple Choice Preview */}
                  {isTypeExam === "pg" && (
                    <>
                      <div className="space-y-2">
                        {examOptions.map((option) => {
                          const answerKey =
                            `answer_${option}` as keyof typeof answer;

                          return (
                            <div
                              key={option}
                              className={`flex items-start gap-3 rounded-xl border p-3 ${
                                selectCorrectAnswer === option
                                  ? "border-emerald-200 bg-emerald-50"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold uppercase text-slate-600">
                                {option}
                              </span>

                              <span className="text-sm leading-6 text-slate-700">
                                {answer[answerKey] ||
                                  `Opsi ${option.toUpperCase()}`}
                              </span>

                              {selectCorrectAnswer === option && (
                                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-600">
                                  Benar
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Essay Preview */}
                  {isTypeExam === "essay" && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Tipe Jawaban
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        Essay
                      </p>
                    </div>
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
                    form="create-exam-form"
                    variant="default"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    Simpan Soal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </div>
  );
}
