import { useManageExamsData } from "@/app/hooks/getDataManageExams";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ChevronDownIcon,
  ClipboardList,
  PenLine,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const examScheduleSchema = z.object({
  examId: z.string(),
  kelas: z.string().optional(),
  tanggalUjian: z.date().optional(),
  mulai: z.string().optional(),
  selesai: z.string().optional(),
  durasi: z.string().optional(),
});

export const sendExamToStudentSchema = z
  .object({
    exams: z.array(examScheduleSchema),
  })
  .superRefine((data, ctx) => {
    let selectedCount = 0;

    data.exams.forEach((exam, index) => {
      // examId bukan penentu apakah row digunakan.
      // Kalau user belum mengisi apapun, row dianggap kosong.
      const isConfigured =
        !!exam.kelas ||
        !!exam.tanggalUjian ||
        !!exam.mulai ||
        !!exam.selesai ||
        !!exam.durasi;

      // Row belum digunakan → abaikan
      if (!isConfigured) {
        return;
      }

      selectedCount++;

      // ==============================
      // Validasi row yang digunakan
      // ==============================

      if (!exam.kelas) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["exams", index, "kelas"],
          message: "Pilih kelas",
        });
      }

      if (!exam.tanggalUjian) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["exams", index, "tanggalUjian"],
          message: "Pilih tanggal ujian",
        });
      }

      if (!exam.mulai) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["exams", index, "mulai"],
          message: "Tentukan waktu mulai",
        });
      }

      if (!exam.selesai) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["exams", index, "selesai"],
          message: "Tentukan waktu selesai",
        });
      }

      if (!exam.durasi) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["exams", index, "durasi"],
          message: "Pilih durasi",
        });
      }

      // ==============================
      // Validasi waktu
      // ==============================

      if (exam.mulai && exam.selesai) {
        const [startHour, startMinute] = exam.mulai.split(":").map(Number);

        const [endHour, endMinute] = exam.selesai.split(":").map(Number);

        const startTime = startHour * 60 + startMinute;

        const endTime = endHour * 60 + endMinute;

        if (endTime <= startTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["exams", index, "selesai"],
            message: "Waktu selesai harus lebih besar dari waktu mulai",
          });
        }
      }
    });

    // Minimal satu ujian harus dipilih
    if (selectedCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["exams"],
        message: "Pilih minimal satu ujian",
      });
    }
  });

type SendExamToStudentSchemaType = z.infer<typeof sendExamToStudentSchema>;

export default function ViewQuestions() {
  const idTeacher = useGetIdUsers((state) => state.idUser);
  const [openDialog, setOpenDialog] = useState(false);
  const viewManageQuestionsExam = useManageExamsData(idTeacher);
  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SendExamToStudentSchemaType>({
    resolver: zodResolver(sendExamToStudentSchema),
    defaultValues: {
      exams: [],
    },
  });

  useEffect(() => {
    if (!viewManageQuestionsExam?.length) return;

    reset({
      exams: viewManageQuestionsExam.map((exam: any) => ({
        examId: String(exam.id),
        kelas: "",
        tanggalUjian: undefined,
        mulai: "",
        selesai: "",
        durasi: "",
      })),
    });
  }, [viewManageQuestionsExam, reset]);

  async function onSubmit(data: SendExamToStudentSchemaType) {
    const selectedExams = data.exams.filter(
      (exam) =>
        exam.kelas &&
        exam.tanggalUjian &&
        exam.mulai &&
        exam.selesai &&
        exam.durasi,
    );

    setOpenDialog(false);

    // if (selectedExams.length > 0) {
    //   const { error } = await supabase
    //     .from("managed_exams")
    //     .insert(selectedExams);
    //   if (error) {
    //     toast("Gagal ❌", {
    //       description: "Error tidak bisa ditambahkan",
    //     });
    //   } else {
    //     toast("Berhasil ✅", {
    //       description: "Soal Berhasil Dikirimkan",
    //     });
    //   }
    // } else {
    //   toast("Gagal ❌", {
    //     description: "Ada Soal Yang Belum di Kelola, Dicek Kembali",
    //   });
    // }

    console.log(selectedExams);
  }

  async function handleDeleteExam(idExams: number) {
    const { error } = await supabase
      .from("exams")
      .delete()
      .eq("id", Number(idExams));

    if (error) {
      toast("Gagal ❌", {
        description: "Soal Gagal Dihapus",
      });
    } else {
      toast("Berhasil ✅", {
        description: "Soal Telah Berhasil Dihapus",
      });
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Exam Management
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Daftar Soal Ujian
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Atur kelas tujuan, jadwal, durasi, dan kelola soal ujian yang
              telah dibuat.
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            {viewManageQuestionsExam.length} Ujian
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        id="form-send-exam"
      >
        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-14 font-semibold text-slate-600">
                  No
                </TableHead>

                <TableHead className="min-w-[220px] font-semibold text-slate-600">
                  Ujian
                </TableHead>

                <TableHead className="min-w-[130px] font-semibold text-slate-600">
                  Kirim Ke
                </TableHead>

                <TableHead className="min-w-[250px] font-semibold text-slate-600">
                  Jadwal Ujian
                </TableHead>

                <TableHead className="min-w-[130px] font-semibold text-slate-600">
                  Durasi
                </TableHead>

                <TableHead className="min-w-[80px] text-center font-semibold text-slate-600">
                  Kelola
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {viewManageQuestionsExam.length > 0 ? (
                viewManageQuestionsExam.map((data: any, i: number) => (
                  <TableRow
                    key={data.id}
                    className="align-top transition-colors hover:bg-slate-50"
                  >
                    {/* Number */}
                    <TableCell className="pt-5 font-semibold text-slate-400">
                      {String(i + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Exam */}
                    <TableCell className="pt-5 max-w-60">
                      <div>
                        <p className="font-bold text-slate-900 truncate">
                          {data.nama_ujian}
                        </p>

                        <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                          {data.tipeUjian === "pg" ? "Pilihan Ganda" : "Essay"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Target Class */}
                    <TableCell className="pt-5">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Kelas
                      </label>

                      <Controller
                        control={control}
                        name={`exams.${i}.kelas`}
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 shadow-none">
                                <SelectValue placeholder="Pilih kelas" />
                              </SelectTrigger>

                              <SelectContent className="rounded-xl bg-white">
                                <SelectItem value="1A">1A</SelectItem>
                                <SelectItem value="2B">2B</SelectItem>
                                <SelectItem value="3A">3A</SelectItem>
                                <SelectItem value="4E">4E</SelectItem>
                                <SelectItem value="5A">5A</SelectItem>
                                <SelectItem value="2C">2C</SelectItem>
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
                    </TableCell>

                    {/* Schedule */}
                    <TableCell className="pt-5">
                      <div className="space-y-3">
                        {/* Date */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Tanggal
                          </label>

                          <Controller
                            control={control}
                            name={`exams.${i}.tanggalUjian`}
                            render={({ field, fieldState }) => (
                              <div className="space-y-1">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="h-10 w-full justify-between rounded-xl border-slate-200 font-medium text-slate-700"
                                    >
                                      {field.value
                                        ? field.value.toLocaleDateString(
                                            "id-ID",
                                            {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                            },
                                          )
                                        : "Pilih Tanggal"}
                                      <ChevronDownIcon className="size-4 text-slate-400" />
                                    </Button>
                                  </PopoverTrigger>

                                  <PopoverContent className="w-auto overflow-hidden rounded-xl p-0">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      captionLayout="dropdown"
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date <
                                        new Date(
                                          new Date().setHours(0, 0, 0, 0),
                                        )
                                      }
                                    />
                                  </PopoverContent>
                                </Popover>
                                {fieldState.error && (
                                  <p className="mt-0.5 text-xs text-red-500">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        </div>

                        {/* Time */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Mulai
                            </label>

                            <Input
                              type="time"
                              {...register(`exams.${i}.mulai`)}
                              className="h-10 rounded-xl border-slate-200 px-3"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Selesai
                            </label>

                            <Input
                              type="time"
                              {...register(`exams.${i}.selesai`)}
                              className="h-10 rounded-xl border-slate-200 px-3"
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="pt-5">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Durasi
                      </label>

                      <Controller
                        control={control}
                        name={`exams.${i}.durasi`}
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 shadow-none">
                                <SelectValue placeholder="Tentukan durasi" />
                              </SelectTrigger>

                              <SelectContent className="rounded-xl bg-white">
                                <SelectItem value="600">10 Menit</SelectItem>
                                <SelectItem value="900">15 Menit</SelectItem>
                                <SelectItem value="1200">20 Menit</SelectItem>
                                <SelectItem value="1500">25 Menit</SelectItem>
                                <SelectItem value="1800">30 Menit</SelectItem>
                                <SelectItem value="2400">40 Menit</SelectItem>
                                <SelectItem value="2700">45 Menit</SelectItem>
                                <SelectItem value="3000">50 Menit</SelectItem>
                                <SelectItem value="3600">60 Menit</SelectItem>
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
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pt-5">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/Teacher/dashboard/manageExams?id=${data.id}`}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          <PenLine className="size-5" />
                        </Link>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 rounded-xl border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700"
                            >
                              <Trash2 className="size-5" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="rounded-2xl sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold">
                                Hapus Soal Ujian
                              </DialogTitle>

                              <DialogDescription className="pt-2 leading-6">
                                Apakah Anda yakin ingin menghapus ujian{" "}
                                <span className="font-bold text-slate-900">
                                  "{data.nama_ujian}"
                                </span>
                                ?
                                <span className="mt-2 block">
                                  Tindakan ini tidak dapat dibatalkan.
                                </span>
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

                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  className="rounded-xl bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteExam(data.id)}
                                >
                                  Hapus Ujian
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="size-9 text-slate-300" />

                      <p className="mt-3 font-semibold text-slate-500">
                        Belum Ada Soal Ujian
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Soal ujian yang dibuat akan muncul di sini.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ================= SEND NOTE + ACTION ================= */}
        <div className="flex flex-col gap-5 border-t border-slate-200 px-5 py-5 sm:px-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 md:max-w-2xl">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />

            <p className="text-sm leading-6 text-amber-700">
              Jika hanya ingin mengirim sebagian soal, isi pengaturan hanya pada
              soal yang ingin dikirim dan biarkan bagian lainnya kosong.
            </p>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="w-full rounded-xl bg-blue-500 px-7 font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-600 md:w-auto"
              >
                Kirim Soal
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Konfirmasi Pengiriman
                </DialogTitle>

                <DialogDescription className="pt-2 text-base leading-6">
                  Apakah Anda yakin ingin mengirimkan soal yang sudah
                  dikonfigurasi kepada siswa?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-4 gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="rounded-xl">
                    Batal
                  </Button>
                </DialogClose>

                <Button
                  variant="default"
                  form="form-send-exam"
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Ya, Kirim Soal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
}
