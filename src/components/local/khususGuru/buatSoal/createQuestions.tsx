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

export default function CreateNewQuestions() {
  const idTeacher = useGetIdUsers((state) => state.idUser);
  const [answer, setAnswer] = useState<any>({
    answer_a: "",
    answer_b: "",
    answer_c: "",
    answer_d: "",
    answer_e: "",
  });
  const [question, setQuestion] = useState<string>("");
  const [selectCorrectAnswer, setSelectCorrectAnswer] = useState<string>("");
  const [nameExam, setNameExams] = useState<string>("");
  const [chooseTypeExams, setChooseTypeExams] = useState<string>("");
  const [selectedValueNameExam, setSelectedValueNameExam] =
    useState<string>("");
  const [clearInput, setClearInput] = useState<boolean>(false);
  const dataNameExam = useManageExamsData(idTeacher);
  const [chooseInputObject, setChooseInputObject] = useState<any>({});
  const { handleValueInput } = useHandleInput(chooseInputObject);

  useEffect(() => {
    if (chooseTypeExams === "pg") {
      if (selectedValueNameExam === "buatUjianBaru") {
        setChooseInputObject({
          nama_ujian: nameExam,
          questions: question,
          answer,
          selectCorrectAnswer,
        });
      } else {
        setChooseInputObject({
          questions: question,
          answer,
          selectCorrectAnswer,
        });
      }
    } else {
      if (selectedValueNameExam === "buatUjianBaru") {
        setChooseInputObject({
          nama_ujian: nameExam,
          questions: question,
        });
      } else {
        setChooseInputObject({
          questions: question,
        });
      }
    }
  }, [
    chooseTypeExams,
    selectedValueNameExam,
    nameExam,
    question,
    answer,
    selectCorrectAnswer,
  ]);

  function isFormFilled() {
    if (chooseTypeExams === "pg") {
      const isArray = Object.values(chooseInputObject).filter(
        (val: any) => typeof val === "string" && val !== null,
      );
      const isObject: string[] = Object.values(chooseInputObject.answer || {});
      const resultData = isArray.concat(isObject);
      return resultData.every((item: string) => item !== "");
    }
    return Object.values(chooseInputObject).every((item) => item !== "");
  }

  function handleAddAnswer(event: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = event.target;
    setAnswer((prev: any) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  }

  async function handleCreateAddQuestion() {
    if (!chooseTypeExams || !selectedValueNameExam) {
      toast("Gagal ❌", {
        description: "Pilih Terlebih Dahulu Tipe Dan Nama Ujiannya",
      });
    } else {
      const { data, error }: any = await supabase
        .from("exams")
        .select("nama_ujian")
        .eq("nama_ujian", nameExam);

      if (data?.length > 0) {
        toast("Gagal ❌", {
          description: "Soalnya Sama Seperti Yang Sebelumnya Telah Dibuat",
        });
      } else if (error) {
        toast("Gagal ❌", {
          description: "Soal Gagal Tambahkan Periksa Kembali Soalnya",
        });
      } else {
        if (chooseTypeExams === "pg") {
          if (selectedValueNameExam === "buatUjianBaru") {
            const { error }: any = await supabase.from("exams").insert([
              {
                created_at_exams: new Date().toISOString(),
                nama_ujian: nameExam,
                questions_exam: [
                  {
                    id: useRandomId(7, "EX"),
                    questions: question,
                    answerPg: answer,
                    correctAnswer: selectCorrectAnswer,
                  },
                ],
                idTeacher: idTeacher,
                tipeUjian: chooseTypeExams,
              },
            ]);

            if (error) {
              toast("Gagal ❌", {
                description: "Soal Gagal Tambahkan Periksa Kembali Soalnya",
              });
            } else {
              toast("Berhasil ✅", {
                description: "Soal Pilihan Ganda Berhasil Ditambahkan",
              });
              setClearInput(true);
            }
          } else {
            const { data, error } = await supabase
              .from("exams")
              .select("questions_exam")
              .eq("nama_ujian", selectedValueNameExam)
              .single();

            if (error) {
              toast("Gagal ❌", {
                description: "Ujian tidak ditemukan.",
              });
            } else {
              const addQuestions = [
                ...(data.questions_exam || []),
                {
                  id: useRandomId(7, "EX"),
                  questions: question,
                  answerPg: answer,
                  correctAnswer: selectCorrectAnswer,
                },
              ];
              const { error }: any = await supabase
                .from("exams")
                .update({ questions_exam: addQuestions })
                .eq("nama_ujian", selectedValueNameExam);

              if (error) {
                toast("Gagal ❌", {
                  description: "Soal Gagal Tambahkan Periksa Kembali Soalnya",
                });
              } else {
                toast("Berhasil ✅", {
                  description: "Soal Berhasil Ditambahkan",
                });
                setClearInput(true);
              }
            }
          }
        } else {
          if (selectedValueNameExam === "buatUjianBaru") {
            const { error: errorAddQuestionsExam } = await supabase
              .from("exams")
              .insert([
                {
                  created_at_exams: new Date().toISOString(),
                  nama_ujian: nameExam,
                  questions_exam: [
                    {
                      id: useRandomId(7, "EX"),
                      questions: question,
                    },
                  ],
                  idTeacher: idTeacher,
                  tipeUjian: chooseTypeExams,
                },
              ]);
            if (errorAddQuestionsExam) {
              toast("Gagal ❌", {
                description: "Soal Gagal Ditambahkan Periksa Kembali Soalnya",
              });
            } else {
              toast("Berhasil ✅", {
                description: "Soal Essay Berhasil Ditambahkan",
              });
              setClearInput(true);
            }
          } else {
            const { data: dataEssay, error: errorDataEssay } = await supabase
              .from("exams")
              .select("questions_exam")
              .eq("nama_ujian", selectedValueNameExam)
              .single();

            if (errorDataEssay) {
              toast("Gagal ❌", {
                description: "Ujian tidak ditemukan.",
              });
            } else {
              const addEssay = [
                ...(dataEssay.questions_exam || []),
                {
                  id: useRandomId(7, "EX"),
                  questions: question,
                },
              ];
              const { error: errorAddDataEssay } = await supabase
                .from("exams")
                .update({ questions_exam: addEssay })
                .eq("nama_ujian", selectedValueNameExam);

              if (errorAddDataEssay) {
                toast("Gagal ❌", {
                  description: "Soal Gagal Tambahkan Periksa Kembali Soalnya",
                });
              } else {
                toast("Berhasil ✅", {
                  description: "Soal Berhasil Ditambahkan",
                });
                setClearInput(true);
              }
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    if (clearInput) {
      if (chooseTypeExams === "pg") {
        setAnswer({
          answer_a: "",
          answer_b: "",
          answer_c: "",
          answer_d: "",
          answer_e: "",
        });
        setSelectCorrectAnswer("");
        setQuestion("");
        setNameExams("");
      } else if (chooseTypeExams === "essay") {
        setQuestion("");
        setNameExams("");
      }
    }
  }, [clearInput, chooseTypeExams]);

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
        <form className="space-y-8">
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

                <Select onValueChange={(val) => setChooseTypeExams(val)}>
                  <SelectTrigger
                    id="exam-type"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 shadow-none"
                  >
                    <SelectValue placeholder="Pilih tipe ujian" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl bg-white">
                    <SelectItem value="pg">Pilihan Ganda</SelectItem>

                    <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Name */}
              <div>
                <label
                  htmlFor="exam-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nama Ujian
                </label>

                <Select onValueChange={(val) => setSelectedValueNameExam(val)}>
                  <SelectTrigger
                    id="exam-name"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 shadow-none"
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
                        nameExam.tipeUjian === chooseTypeExams;

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
              </div>
            </div>

            {/* New Exam Name */}
            {selectedValueNameExam === "buatUjianBaru" && (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <label
                  htmlFor="nama_ujian"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nama Ujian Baru
                </label>

                <Input
                  id="nama_ujian"
                  className="h-12 rounded-xl border-slate-200 bg-white"
                  placeholder="Contoh: Ujian Matematika Semester 1"
                  onChange={(e) => {
                    handleValueInput(e);
                    setNameExams(e.currentTarget.value);
                  }}
                  value={nameExam}
                />
              </div>
            )}
          </section>

          {/* ================= QUESTION ================= */}
          <section className="border-t border-slate-100 pt-8">
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
                placeholder="Tulis pertanyaan ujian di sini..."
                className="min-h-32 resize-y rounded-xl border-slate-200 bg-white p-4 text-sm leading-6"
                onChange={(e) => {
                  handleValueInput(e);
                  setQuestion(e.currentTarget.value);
                }}
                value={question}
              />
            </div>
          </section>

          {/* ================= MULTIPLE CHOICE ================= */}
          {chooseTypeExams === "pg" && (
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
                        placeholder={`Masukkan opsi ${option.toUpperCase()}`}
                        className="h-11 rounded-xl border-slate-200"
                        value={answer[answerKey]}
                        onChange={(e) => {
                          handleValueInput(e);
                          handleAddAnswer(e);
                        }}
                      />
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

                <Select onValueChange={(val) => setSelectCorrectAnswer(val)}>
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
                          {answer[answerKey] || `Opsi ${option.toUpperCase()}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </section>
          )}

          {/* ================= ACTION ================= */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">
              Pastikan seluruh informasi soal sudah benar sebelum disimpan.
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  disabled={!isFormFilled()}
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
                      {question}
                    </p>
                  </div>

                  {/* Multiple Choice Preview */}
                  {chooseTypeExams === "pg" && (
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
                  {chooseTypeExams === "essay" && (
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

                  <DialogClose asChild>
                    <Button
                      variant="default"
                      onClick={handleCreateAddQuestion}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700"
                    >
                      Simpan Soal
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </div>
  );
}
