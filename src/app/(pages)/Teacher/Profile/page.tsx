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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { useGetDataUsers } from "@/store/useGetDataUsers/state";
import MainContent from "@/layout/mainContent/content";
import HamburgerMenu from "@/components/global/hamburgerMenu/content";
import ListSidebar from "@/components/global/listSidebar/content";
import { History } from "lucide-react";
import HeaderProfile from "@/layout/headerProfile/content";

export default function TeacherProfile() {
  const getidTeacher = useGetIdUsers((state) => state.idUser);
  const [getHistoryExams, setGetHistoryExams] = useState<string[]>([]);
  const getProfileTeacher = useGetDataUsers((state) => state.dataUsers);

  useEffect(() => {
    if (!getidTeacher) return;
    async function historyExams() {
      const [
        { data: dataManageExams, error: errorDataManageExams },
        { data: dataHistoryExams, error: errorDataHistoryExams },
      ]: any = await Promise.all([
        supabase
          .from("managed_exams")
          .select("kelas,dibuat_tgl,id_Teacher,idExams")
          .eq("id_Teacher", getidTeacher),
        supabase
          .from("history-exam-student")
          .select(
            "exam_id,hasil_ujian,student_id,kelas,exams(nama_ujian,tipeUjian,idTeacher)",
          )
          .eq("exams.idTeacher", getidTeacher),
      ]);

      if (errorDataManageExams || errorDataHistoryExams) {
        toast("Gagal ❌", {
          description: "Data Error Ditampilkan",
        });
      }

      const fillterNotNull = dataHistoryExams.filter(
        (data: any) => data.exams !== null,
      );

      const result = fillterNotNull?.reduce((acc: any, cur: any) => {
        const found = acc.find(
          (item: any) =>
            item.kelas === cur.kelas && item.exam_id === cur.exam_id,
        );
        if (!found) {
          acc.push({
            kelas: cur.kelas,
            exam_id: cur.exam_id,
            nama_ujian: cur.exams.nama_ujian,
            tipeUjian: cur.exams.tipeUjian,
            hasil_ujian: [cur.hasil_ujian],
            student_id: [cur.student_id],
          });
        } else {
          found.hasil_ujian.push(cur.hasil_ujian);
          found.student_id.push(cur.student_id);
        }
        return acc;
      }, []);

      const mergedData = result?.map(
        (item: { kelas: string; exam_id: number }) => {
          const findDetail = dataManageExams.find(
            (f: { kelas: string; idExams: number }) =>
              f.kelas === item.kelas && f.idExams === item.exam_id,
          );
          return {
            ...item,
            ...findDetail,
          };
        },
      );

      setGetHistoryExams(mergedData);
    }
    historyExams();
  }, [getidTeacher]);

  async function handleEditProfileTeacher(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const fieldNames = [
      "fullName",
      "pengajarMapel",
      "noTlp",
      "email",
      "password",
    ];
    const payloadString = fieldNames.map(
      (id: string) => event.currentTarget[id].value || "",
    );
    const payload = fieldNames.reduce((acc: any, key: string, i: number) => {
      const val = payloadString[i];
      if (val !== "") {
        acc[key] = val;
      }
      return acc;
    }, {});

    const { error } = await supabase
      .from("account_teacher")
      .update(payload)
      .eq("id_teacher", getidTeacher);

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

  function resultNilaiRataRata(data: { hasil_ujian: string[] }) {
    const hasilUjian = data.hasil_ujian;

    const nilaiUjian = hasilUjian
      .filter((fil: any) => fil !== "pending" && fil !== "telat")
      .map(Number);
    const nilaiPending = hasilUjian.filter((fil: string) => fil === "pending");
    const nilaiTelat = hasilUjian.filter((fil: string) => fil === "telat");

    const nilaiYangPendingAtauTelat =
      nilaiPending.length > 0 || nilaiTelat.length > 0;

    const nilaiRataRata =
      nilaiUjian.length > 0
        ? Math.round(
            nilaiUjian.reduce((acc: number, cur: number) => acc + cur, 0) /
              nilaiUjian.length,
          )
        : 0;

    function getMessage() {
      if (nilaiPending.length > 0 && nilaiTelat.length > 0) {
        return `Ada ${nilaiTelat.length} siswa telat dan ${nilaiPending.length} belum dinilai`;
      }

      if (nilaiTelat.length > 0) {
        return `Ada ${nilaiTelat.length} Siswa Yang Telat Mengerjakan`;
      }

      return `Ada ${nilaiPending.length} siswa yang belum dinilai`;
    }

    if (nilaiYangPendingAtauTelat) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <h1>{nilaiRataRata}</h1>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2">
            <h1 className="font-semibold text-xs">{getMessage()}</h1>
          </PopoverContent>
        </Popover>
      );
    }
    return nilaiRataRata;
  }

  return (
    <MainContent>
      {getHistoryExams.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-3xl font-bold">Profil Guru</h1>
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
                  {getProfileTeacher?.fullName || ""}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold backdrop-blur-sm shadow-sm">
                    NISN. {getProfileTeacher?.nisn || ""}
                  </span>

                  <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold backdrop-blur-sm shadow-sm">
                    {getProfileTeacher?.pengajarMapel || ""}
                  </span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-xl border border-white/20 bg-white px-5 font-semibold text-blue-600 shadow-md hover:bg-blue-50">
                    Edit Profil
                  </Button>
                </DialogTrigger>

                <DialogContent className="rounded-2xl sm:max-w-lg">
                  <form
                    className="grid gap-5"
                    onSubmit={(event) => handleEditProfileTeacher(event)}
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
                      <label htmlFor="fullName" className="mb-2 block">
                        Nama
                      </label>
                      <Input id="fullName" placeholder="Jhon Doe" />
                    </div>
                    <div>
                      <label htmlFor="pengajarMapel" className="mb-2 block">
                        Ubah Pengajar Mata Pelajaran
                      </label>
                      <Input
                        id="pengajarMapel"
                        placeholder="Matematika - Bahasa Indonesia - dst"
                      />
                    </div>
                    <div>
                      <label htmlFor="noTlp" className="mb-2 block">
                        Ubah No Telepon
                      </label>
                      <Input id="noTlp" placeholder="089276361434" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block">
                        Email
                      </label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="jhondoe56@gmail.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="mb-2 block">
                        Ubah Password
                      </label>
                      <Input
                        type="password"
                        id="password"
                        placeholder="**********"
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

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Header */}
              <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <History className="size-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                        Exam History
                      </p>

                      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        Riwayat Ujian yang Dibuat
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Lihat ringkasan ujian yang telah Anda buat dan kelola.
                      </p>
                    </div>
                  </div>

                  {/* Total Exam */}
                  <div className="ml-13 w-fit rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 sm:ml-0">
                    {getHistoryExams?.length || 0} Ujian
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="w-14 font-semibold text-slate-600">
                        No
                      </TableHead>

                      <TableHead className="min-w-[220px] font-semibold text-slate-600">
                        Nama Ujian
                      </TableHead>

                      <TableHead className="min-w-[130px] text-center font-semibold text-slate-600">
                        Jumlah Siswa
                      </TableHead>

                      <TableHead className="min-w-[150px] text-center font-semibold text-slate-600">
                        Nilai Rata-Rata
                      </TableHead>

                      <TableHead className="min-w-[120px] text-center font-semibold text-slate-600">
                        Kelas
                      </TableHead>

                      <TableHead className="min-w-[150px] text-center font-semibold text-slate-600">
                        Tanggal
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {getHistoryExams?.length > 0 ? (
                      getHistoryExams.map((item: any, i: number) => (
                        <TableRow
                          key={item.id ?? i}
                          className="transition-colors hover:bg-slate-50"
                        >
                          {/* No */}
                          <TableCell className="font-semibold text-slate-400">
                            {String(i + 1).padStart(2, "0")}
                          </TableCell>

                          {/* Exam */}
                          <TableCell>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {item.nama_ujian || "-"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                Ujian yang telah dibuat
                              </p>
                            </div>
                          </TableCell>

                          {/* Student Count */}
                          <TableCell className="text-center">
                            <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">
                              {item.student_id?.length || 0} Siswa
                            </span>
                          </TableCell>

                          {/* Average Score */}
                          <TableCell className="text-center">
                            <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                              {resultNilaiRataRata(item) || 0}
                            </span>
                          </TableCell>

                          {/* Class */}
                          <TableCell className="text-center">
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                              {item.kelas || "-"}
                            </span>
                          </TableCell>

                          {/* Date */}
                          <TableCell className="text-center text-sm font-medium text-slate-500">
                            {item.dibuat_tgl || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-40 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <History className="size-9 text-slate-300" />

                            <p className="mt-3 font-semibold text-slate-500">
                              Belum Ada Riwayat Ujian
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              Ujian yang telah dibuat akan muncul di sini.
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
        <>
          <div className="w-1/3 h-10 bg-slate-500 animate-pulse rounded-md"></div>
          <div className="h-1 bg-slate-500 animate-pulse rounded-md my-3" />
          <div className="mt-7">
            <div className="flex justify-center items-center gap-7 mb-10 flex-col sm:flex-row sm:mb-5">
              <div className="w-28 h-28 rounded-full bg-slate-500 animate-pulse"></div>

              <div className="w-2/3">
                <h1 className="mb-2 bg-slate-500 animate-pulse rounded-md w-2/3 h-7"></h1>
                <p className="bg-slate-500 animate-pulse rounded-md w-1/3 h-5"></p>
              </div>
              <div className="w-20 h-8 bg-slate-500 animate-pulse rounded-md"></div>
            </div>

            <div className="mb-5">
              <div className="flex items-center mb-5 gap-3">
                <div className="w-9 h-7 rounded-md bg-slate-500 animate-pulse"></div>
                <div className="w-1/5 h-7 rounded-md bg-slate-500 animate-pulse"></div>
              </div>
              <div>
                <div className="w-11/12 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
                <div className="w-3/4 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
                <div className="w-10/12 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
                <div className="w-1/2 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
                <div className="w-1/4 h-7 rounded-md bg-slate-500 animate-pulse mb-2"></div>
                <div className="w-1/3 h-7 rounded-md bg-slate-500 animate-pulse"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-5 gap-3">
                <div className="w-9 h-7 rounded-md bg-slate-500 animate-pulse"></div>
                <div className="w-1/3 h-7 rounded-md bg-slate-500 animate-pulse"></div>
              </div>

              <div className="w-full h-7 rounded-md bg-slate-500 animate-pulse mb-3"></div>
              <div className="w-full h-7 rounded-md bg-slate-500 animate-pulse mb-3"></div>
              <div className="w-full h-7 rounded-md bg-slate-500 animate-pulse mb-3"></div>
            </div>
          </div>
        </>
      )}
    </MainContent>
  );
}
