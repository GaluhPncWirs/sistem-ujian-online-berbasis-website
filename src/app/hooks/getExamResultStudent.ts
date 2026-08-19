import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";

export function usePendingExamResultsStudent(idTeacher: string | null) {
  const [pendingResults, setPendingResults] = useState<any[]>([]);

  useEffect(() => {
    if (!idTeacher) {
      setPendingResults([]);
      return;
    }

    let isMounted = true;

    async function getPendingResults() {
      const { data, error } = await supabase
        .from("history-exam-student")
        .select(
          `
            student_id,
            exam_id,
            hasil_ujian,
            status_exam,
            created_at,
            exams!inner (
              id,
              nama_ujian,
              tipeUjian,
              idTeacher
            )
          `,
        )
        .eq("exams.idTeacher", idTeacher)
        .eq("hasil_ujian", "pending")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Gagal mengambil pending exam:", error);

        return;
      }

      if (!isMounted) return;

      const results = (data ?? []).map((history: any) => {
        const exam = Array.isArray(history.exams)
          ? history.exams[0]
          : history.exams;

        return {
          student_id: history.student_id,
          idUjian: history.exam_id,
          namaUjian: exam?.nama_ujian ?? null,
          tipe_ujian: exam?.tipeUjian ?? null,
          hasil_ujian: history.hasil_ujian,
          status_exam: history.status_exam,
          created_at: history.created_at,
        };
      });

      setPendingResults(results);
    }

    getPendingResults();

    return () => {
      isMounted = false;
    };
  }, [idTeacher]);

  return pendingResults;
}
