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
import { AlertCircle, ChevronDownIcon, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ViewQuestions() {
  const idTeacher = useGetIdUsers((state) => state.idUser);
  const [chooseClass, setChooseClass] = useState<string[]>([]);
  const [chooseTimeExam, setChooseTimeExam] = useState<string[]>([]);
  const [dates, setDates] = useState<(Date | undefined)[]>([]);
  const [fromTimes, setFromTimes] = useState<string[]>([]);
  const [toTimes, setToTimes] = useState<string[]>([]);
  const viewManageQuestionsExam = useManageExamsData(idTeacher);
  const tenggatWaktu = fromTimes.map(
    (time: any, i: number) => `${time} - ${toTimes[i]}`,
  );

  const manipulateDate = dates.map((localDate: any) => {
    return new Date(localDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  async function managedExams() {
    const idExam = viewManageQuestionsExam.map((item: any) => item.id);
    const dataPayload = idExam
      .map((item: any, i: number) => ({
        created_at: new Date().toISOString(),
        idExams: item,
        kelas: chooseClass[i],
        dibuat_tgl: manipulateDate[i],
        id_Teacher: idTeacher,
        tenggat_waktu: tenggatWaktu[i],
        exam_duration: Number(chooseTimeExam[i]),
        isManageExam: true,
        tipe_ujian: item.tipeUjian === "pg" ? "pg" : "essay",
      }))
      .filter(
        (item: any) =>
          item.kelas &&
          item.dibuat_tgl &&
          item.tenggat_waktu &&
          item.exam_duration,
      );

    if (dataPayload.length > 0) {
      const { error } = await supabase
        .from("managed_exams")
        .insert(dataPayload);
      if (error) {
        toast("Gagal ❌", {
          description: "Error tidak bisa ditambahkan",
        });
      } else {
        toast("Berhasil ✅", {
          description: "Soal Berhasil Dikirimkan",
        });
      }
    } else {
      toast("Gagal ❌", {
        description: "Ada Soal Yang Belum di Kelola, Dicek Kembali",
      });
    }
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

              <TableHead className="min-w-[150px] font-semibold text-slate-600">
                Kirim Ke
              </TableHead>

              <TableHead className="min-w-[340px] font-semibold text-slate-600">
                Jadwal Ujian
              </TableHead>

              <TableHead className="min-w-[150px] font-semibold text-slate-600">
                Durasi
              </TableHead>

              <TableHead className="min-w-[170px] text-center font-semibold text-slate-600">
                Kelola
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {viewManageQuestionsExam.length > 0 ? (
              viewManageQuestionsExam.map((data: any, i: number) => (
                <TableRow
                  key={i}
                  className="align-top transition-colors hover:bg-slate-50"
                >
                  {/* Number */}
                  <TableCell className="pt-5 font-semibold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </TableCell>

                  {/* Exam */}
                  <TableCell className="pt-5">
                    <div>
                      <p className="font-bold text-slate-900">
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

                    <Select
                      onValueChange={(val) =>
                        setChooseClass((prev: any) => {
                          const updateClass = [...prev];
                          updateClass[i] = val;
                          return updateClass;
                        })
                      }
                    >
                      <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white">
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
                  </TableCell>

                  {/* Schedule */}
                  <TableCell className="pt-5">
                    <div className="space-y-3">
                      {/* Date */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Tanggal
                        </label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 w-full justify-between rounded-xl border-slate-200 font-medium text-slate-700"
                            >
                              {dates[i]
                                ? dates[i]?.toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Pilih tanggal"}

                              <ChevronDownIcon className="size-4 text-slate-400" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto overflow-hidden rounded-xl p-0">
                            <Calendar
                              mode="single"
                              selected={dates[i]}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                const newDate = [...dates];
                                newDate[i] = date;
                                setDates(newDate);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Time */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Mulai
                          </label>

                          <Input
                            type="time"
                            value={fromTimes[i] || "00:00"}
                            onChange={(e) => {
                              const newTime = [...fromTimes];
                              newTime[i] = e.currentTarget.value;
                              setFromTimes(newTime);
                            }}
                            className="h-10 rounded-xl border-slate-200 px-3"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Selesai
                          </label>

                          <Input
                            type="time"
                            value={toTimes[i] || "00:00"}
                            onChange={(e) => {
                              const newTime = [...toTimes];
                              newTime[i] = e.currentTarget.value;
                              setToTimes(newTime);
                            }}
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

                    <Select
                      onValueChange={(val) =>
                        setChooseTimeExam((prev: any) => {
                          const updateTime = [...prev];
                          updateTime[i] = val;
                          return updateTime;
                        })
                      }
                    >
                      <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white">
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
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pt-5">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/Teacher/dashboard/manageExams?id=${data.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        Edit Soal
                      </Link>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700"
                          >
                            Hapus
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
                              <Button variant="outline" className="rounded-xl">
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

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full rounded-xl bg-blue-600 px-7 font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 md:w-auto">
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

              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={managedExams}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Ya, Kirim Soal
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
