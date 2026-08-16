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
import { useHandleInput } from "@/app/hooks/getHandleInput";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const createExamSchema = z
  .object({
    typeUjian: z.string().min(1, "Pilih salah satu"),
    namaUjian: z.string().min(1, "Pilih salah satu"),
    namaUjianBaru: z.string().min(5, "Minimal 5 karakter"),
    pertanyaan: z.string().min(5, "Minimal 5 karakter"),

    // pilihan ganda
    opsiA: z.string().min(3, "Minimal 3 karakter"),
    opsiB: z.string().min(3, "Minimal 3 karakter"),
    opsiC: z.string().min(3, "Minimal 3 karakter"),
    opsiD: z.string().min(3, "Minimal 3 karakter"),
    opsiE: z.string().min(3, "Minimal 3 karakter"),
    jawabanYangBenar: z.string().min(1, "Pilih salah satu"),
  })
  .superRefine((data, ctx) => {
    if (data.namaUjian === "buatUjianBaru" && !data.namaUjianBaru) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nama ujian baru harus diisi",
      });
    }

    if (data.typeUjian === "pg") {
      if (
        !data.opsiA ||
        !data.opsiB ||
        !data.opsiC ||
        !data.opsiD ||
        !data.opsiE
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Semua opsi jawaban harus diisi",
        });
      }
      if (!data.jawabanYangBenar) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pilih jawaban yang benar",
        });
      }
    }
  });

type CreateExamSchemaType = z.infer<typeof createExamSchema>;

export default function CreateNewQuestions() {
  const idTeacher = useGetIdUsers((state) => state.idUser);
  const dataNameExam = useManageExamsData(idTeacher);
  const [openDialog, setOpenDialog] = useState(false);
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<CreateExamSchemaType>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      typeUjian: "",
      namaUjian: "",
      namaUjianBaru: "",
      pertanyaan: "",

      // pilihan ganda
      opsiA: "",
      opsiB: "",
      opsiC: "",
      opsiD: "",
      opsiE: "",
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
    answer_a: watch("opsiA"),
    answer_b: watch("opsiB"),
    answer_c: watch("opsiC"),
    answer_d: watch("opsiD"),
    answer_e: watch("opsiE"),
  };
  const selectCorrectAnswer = watch("jawabanYangBenar");

  async function onSubmit(data: CreateExamSchemaType) {
    console.log(data);
    setOpenDialog(false);
  }

  // async function handleCreateAddQuestion() {
  //   if (!chooseTypeExams || !selectedValueNameExam) {
  //     toast("Gagal ❌", {
  //       description: "Pilih Terlebih Dahulu Tipe Dan Nama Ujiannya",
  //     });
  //   } else {
  //     const { data, error }: any = await supabase
  //       .from("exams")
  //       .select("nama_ujian")
  //       .eq("nama_ujian", nameExam);

  //     if (data?.length > 0) {
  //       toast("Gagal ❌", {
  //         description: "Soalnya Sama Seperti Yang Sebelumnya Telah Dibuat",
  //       });
  //     } else if (error) {
  //       toast("Gagal ❌", {
  //         description: "Soal Gagal Tambahkan Periksa Kembali Soalnya",
  //       });
  //     } else {
  //       if (chooseTypeExams === "pg") {
  //         if (selectedValueNameExam === "buatUjianBaru") {
  //           const { error }: any = await supabase.from("exams").insert([
  //             {
  //               created_at_exams: new Date().toISOString(),
  //               nama_ujian: nameExam,
  //               questions_exam: [
  //                 {
  //                   id: useRandomId(7, "EX"),
  //                   questions: question,
  //                   answerPg: answer,
  //                   correctAnswer: selectCorrectAnswer,
  //                 },
  //               ],
  //               idTeacher: idTeacher,
  //               tipeUjian: chooseTypeExams,
  //             },
  //           ]);

  //           if (error) {
  //             toast("Gagal ❌", {
  //               description: "Soal Gagal Tambahkan Periksa Kembali Soalnya",
  //             });
  //           } else {
  //             toast("Berhasil ✅", {
  //               description: "Soal Pilihan Ganda Berhasil Ditambahkan",
  //             });
  //             setClearInput(true);
  //           }
  //         } else {
  //           const { data, error } = await supabase
  //             .from("exams")
  //             .select("questions_exam")
  //             .eq("nama_ujian", selectedValueNameExam)
  //             .single();

  //           if (error) {
  //             toast("Gagal ❌", {
  //               description: "Ujian tidak ditemukan.",
  //             });
  //           } else {
  //             const addQuestions = [
  //               ...(data.questions_exam || []),
  //               {
  //                 id: useRandomId(7, "EX"),
  //                 questions: question,
  //                 answerPg: answer,
  //                 correctAnswer: selectCorrectAnswer,
  //               },
  //             ];
  //             const { error }: any = await supabase
  //               .from("exams")
  //               .update({ questions_exam: addQuestions })
  //               .eq("nama_ujian", selectedValueNameExam);

  //             if (error) {
  //               toast("Gagal ❌", {
  //                 description: "Soal Gagal Tambahkan Periksa Kembali Soalnya",
  //               });
  //             } else {
  //               toast("Berhasil ✅", {
  //                 description: "Soal Berhasil Ditambahkan",
  //               });
  //               setClearInput(true);
  //             }
  //           }
  //         }
  //       } else {
  //         if (selectedValueNameExam === "buatUjianBaru") {
  //           const { error: errorAddQuestionsExam } = await supabase
  //             .from("exams")
  //             .insert([
  //               {
  //                 created_at_exams: new Date().toISOString(),
  //                 nama_ujian: nameExam,
  //                 questions_exam: [
  //                   {
  //                     id: useRandomId(7, "EX"),
  //                     questions: question,
  //                   },
  //                 ],
  //                 idTeacher: idTeacher,
  //                 tipeUjian: chooseTypeExams,
  //               },
  //             ]);
  //           if (errorAddQuestionsExam) {
  //             toast("Gagal ❌", {
  //               description: "Soal Gagal Ditambahkan Periksa Kembali Soalnya",
  //             });
  //           } else {
  //             toast("Berhasil ✅", {
  //               description: "Soal Essay Berhasil Ditambahkan",
  //             });
  //             setClearInput(true);
  //           }
  //         } else {
  //           const { data: dataEssay, error: errorDataEssay } = await supabase
  //             .from("exams")
  //             .select("questions_exam")
  //             .eq("nama_ujian", selectedValueNameExam)
  //             .single();

  //           if (errorDataEssay) {
  //             toast("Gagal ❌", {
  //               description: "Ujian tidak ditemukan.",
  //             });
  //           } else {
  //             const addEssay = [
  //               ...(dataEssay.questions_exam || []),
  //               {
  //                 id: useRandomId(7, "EX"),
  //                 questions: question,
  //               },
  //             ];
  //             const { error: errorAddDataEssay } = await supabase
  //               .from("exams")
  //               .update({ questions_exam: addEssay })
  //               .eq("nama_ujian", selectedValueNameExam);

  //             if (errorAddDataEssay) {
  //               toast("Gagal ❌", {
  //                 description: "Soal Gagal Tambahkan Periksa Kembali Soalnya",
  //               });
  //             } else {
  //               toast("Berhasil ✅", {
  //                 description: "Soal Berhasil Ditambahkan",
  //               });
  //               setClearInput(true);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

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
                {["a", "b", "c", "d", "e"].map((option: string) => {
                  const answerKey = `answer_${option}`;
                  const optionField = `opsi${option.toUpperCase()}` as
                    | "opsiA"
                    | "opsiB"
                    | "opsiC"
                    | "opsiD"
                    | "opsiE";

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
                      {errors[optionField] && (
                        <p className="text-red-500 text-xs mt-0.5">
                          {errors[optionField]?.message}
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
                        {["a", "b", "c", "d", "e"].map((option: string) => {
                          const answerKey = `answer_${option}`;

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
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">
              Pastikan seluruh informasi soal sudah benar sebelum disimpan.
            </p>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  // disabled={!isFormFilled()}
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
                        {["a", "b", "c", "d", "e"].map((option) => {
                          const answerKey = `answer_${option}`;

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
