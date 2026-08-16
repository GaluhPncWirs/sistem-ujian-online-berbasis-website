import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCheck } from "lucide-react";

type PropsListJadwalUjian = {
  manageDataExams: {
    lengthStudent: string[];
    lengthStudentCompleteExams: string[];
    nama_ujian: string;
    kelas: string;
    dibuat_tgl: string;
    tenggat_waktu: string;
  }[];
};

export default function ListJadwalUjian({
  manageDataExams,
}: PropsListJadwalUjian) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Overview
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Jadwal Ujian Hari Ini
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Pantau status pelaksanaan ujian yang sedang dikelola.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto pb-3">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-600">No</TableHead>

              <TableHead className="font-semibold text-slate-600">
                Nama Ujian
              </TableHead>

              <TableHead className="font-semibold text-slate-600">
                Kelas
              </TableHead>

              <TableHead className="font-semibold text-slate-600">
                Tenggat Waktu
              </TableHead>

              <TableHead className="font-semibold text-slate-600">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {manageDataExams.length > 0 ? (
              manageDataExams.map((item: any, i: number) => {
                const isComplete =
                  item.lengthStudent.length ===
                  item.lengthStudentCompleteExams?.length;

                return (
                  <TableRow
                    key={i}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="font-medium text-slate-500">
                      {i + 1}
                    </TableCell>

                    <TableCell className="font-semibold text-slate-800">
                      {item.exams?.nama_ujian || "-"}
                    </TableCell>

                    <TableCell className="text-sm text-slate-600">
                      {item.kelas || "-"}
                    </TableCell>

                    <TableCell className="text-sm text-slate-500">
                      {item.dibuat_tgl} {item.tenggat_waktu}
                    </TableCell>

                    <TableCell>
                      {isComplete ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                          Belum Selesai
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ClipboardCheck className="size-8 text-slate-300" />

                    <p className="mt-3 font-semibold text-slate-500">
                      Belum Ada Ujian
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Ujian yang Anda kelola akan muncul di sini.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
