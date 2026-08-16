import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";

export function useManageDataExams(getidTeacher: string) {
  const [dataManageExams, setDataManageExams] = useState<any[]>([]);

  useEffect(() => {
    if (!getidTeacher) {
      setDataManageExams([]);
      return;
    }

    let isMounted = true;

    async function getDataManageExams() {
      const [
        { data: managedExams, error: managedExamsError },
        { data: historyExams, error: historyExamsError },
        { data: students, error: studentsError },
      ] = await Promise.all([
        supabase
          .from("managed_exams")
          .select(
            "nama_ujian, kelas, dibuat_tgl, tenggat_waktu, idExams, exams (nama_ujian)",
          )
          .eq("id_Teacher", getidTeacher),

        supabase
          .from("history-exam-student")
          .select(
            `exam_id, student_id, kelas, hasil_ujian, status_exam, exams!inner (idTeacher)`,
          )
          .eq("exams.idTeacher", getidTeacher),

        supabase.from("account-student").select("classes, idStudent"),
      ]);

      if (managedExamsError || historyExamsError || studentsError) {
        console.error("Gagal mengambil data manage exams:", {
          managedExamsError,
          historyExamsError,
          studentsError,
        });

        return;
      }

      if (!isMounted) return;

      // =========================================================
      // 1. Buat Map history berdasarkan kelas + exam_id
      // =========================================================

      const completeExamMap = new Map<
        string,
        {
          studentIds: string[];
          examIds: string[];
          hasilUjian: unknown[];
        }
      >();

      historyExams?.forEach((item) => {
        if (!item.exams) return;

        const key = `${item.kelas}_${item.exam_id}`;

        const existing = completeExamMap.get(key);

        if (existing) {
          existing.studentIds.push(item.student_id);
          existing.examIds.push(item.exam_id);
          existing.hasilUjian.push(item.hasil_ujian);
        } else {
          completeExamMap.set(key, {
            studentIds: [item.student_id],
            examIds: [item.exam_id],
            hasilUjian: [item.hasil_ujian],
          });
        }
      });

      // =========================================================
      // 2. Buat Map jumlah siswa berdasarkan kelas
      // =========================================================

      const studentMap = new Map<string, string[]>();

      students?.forEach((student) => {
        const existingStudents = studentMap.get(student.classes) ?? [];

        existingStudents.push(student.idStudent);

        studentMap.set(student.classes, existingStudents);
      });

      // =========================================================
      // 3. Gabungkan managed exams dengan history + student
      // =========================================================

      const mergedData =
        managedExams?.map((exam) => {
          const key = `${exam.kelas}_${exam.idExams}`;

          const examHistory = completeExamMap.get(key);

          const classStudents = studentMap.get(exam.kelas) ?? [];

          return {
            ...exam,

            lengthStudent: classStudents,

            lengthStudentCompleteExams: examHistory?.studentIds ?? [],

            hasil_ujian: examHistory?.hasilUjian ?? [],
          };
        }) ?? [];

      setDataManageExams(mergedData);
    }

    getDataManageExams();

    return () => {
      isMounted = false;
    };
  }, [getidTeacher]);

  return dataManageExams;
}
