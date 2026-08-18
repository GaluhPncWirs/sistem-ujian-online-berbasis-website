import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/data";
import { toast } from "sonner";

export function useDataExams(
  dataStudent: { classes: string } | null,
  getIdStudent: string,
) {
  const [scheduleExams, setScheduleExams] = useState<any>([]);

  useEffect(() => {
    if (!dataStudent?.classes || !getIdStudent) return;
    async function getDataExamResult() {
      const [
        { data: examsData, error: examsError },
        { data: historyDataExams, error: historyDataError },
      ] = await Promise.all([
        supabase
          .from("managed_exams")
          .select(
            "*,account_teacher(fullName),exams(nama_ujian,questions_exam)",
          )
          .eq("kelas", dataStudent?.classes),
        supabase
          .from("history-exam-student")
          .select(
            "student_id,exam_id,status_exam,created_at,hasil_ujian,exams(nama_ujian)",
          )
          .eq("student_id", getIdStudent),
      ]);

      if (examsError || historyDataError) {
        toast("data tidak bisa ditampilkan, error");
        return;
      }

      const mergedDataScheduleExams = examsData.map(
        (item: { idExams: number }) => {
          const finds = historyDataExams.find(
            (f: { exam_id: number }) => f.exam_id === item.idExams,
          );
          return {
            ...item,
            status_exam: finds?.status_exam ?? null,
            created_at_historyExams: finds?.created_at ?? null,
            hasil_ujian: finds?.hasil_ujian ?? null,
          };
        },
      );

      setScheduleExams(mergedDataScheduleExams);
    }
    getDataExamResult();
  }, [dataStudent?.classes, getIdStudent]);

  return scheduleExams;
}
