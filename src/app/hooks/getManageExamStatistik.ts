import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";

type ManageExamStatistics = {
  jumlahSiswa: number;
  averageValueExam: number;
};

export function useGetStatistics(idTeacher: string | null) {
  const [statistics, setStatistics] = useState<ManageExamStatistics>({
    jumlahSiswa: 0,
    averageValueExam: 0,
  });

  useEffect(() => {
    if (!idTeacher) {
      setStatistics({ jumlahSiswa: 0, averageValueExam: 0 });
      return;
    }

    let isMounted = true;

    async function getStatistics() {
      const [
        { data: managedExams, error: managedExamsError },
        { data: historyExams, error: historyExamsError },
      ] = await Promise.all([
        supabase
          .from("managed_exams")
          .select("kelas")
          .eq("id_Teacher", idTeacher),

        supabase
          .from("history-exam-student")
          .select(
            `
          student_id,
          hasil_ujian,
          exams!inner (
            idTeacher
          )
        `,
          )
          .eq("exams.idTeacher", idTeacher),
      ]);

      if (managedExamsError || historyExamsError) {
        console.error("Gagal mengambil statistik:", {
          managedExamsError,
          historyExamsError,
        });

        return;
      }

      if (!isMounted) return;

      // ==========================================
      // Ambil kelas unik yang dikelola teacher
      // ==========================================

      const classes = [
        ...new Set(
          (managedExams ?? []).map((exam) => exam.kelas).filter(Boolean),
        ),
      ];

      // ==========================================
      // Ambil siswa hanya dari kelas tersebut
      // ==========================================

      let jumlahSiswa = 0;

      if (classes.length > 0) {
        const { data: students, error: studentsError } = await supabase
          .from("account-student")
          .select("idStudent")
          .in("classes", classes);

        if (studentsError) {
          console.error("Gagal mengambil siswa:", studentsError);

          return;
        }

        jumlahSiswa = new Set(
          (students ?? []).map((student) => student.idStudent),
        ).size;
      }

      // ==========================================
      // Hitung rata-rata seluruh nilai
      // ==========================================

      const examScores = (historyExams ?? [])
        .map((item) => item.hasil_ujian)
        .filter((value) => value !== "pending" && value !== "telat")
        .map(Number)
        .filter(Number.isFinite);

      const averageValueExam =
        examScores.length > 0
          ? examScores.reduce((sum, value) => sum + value, 0) /
            examScores.length
          : 0;

      setStatistics({
        jumlahSiswa,
        averageValueExam,
      });
    }

    getStatistics();

    return () => {
      isMounted = false;
    };
  }, [idTeacher]);

  return statistics;
}
