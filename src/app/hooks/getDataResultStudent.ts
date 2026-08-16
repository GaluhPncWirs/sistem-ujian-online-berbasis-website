import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/data";

type ExamResult = {
  namaUjian: string | null;
  idUjian: string;
  tipe_ujian: string | null;
  hasil_ujian: number | null;
  status_exam: boolean | null;
};

type StudentExamResult = {
  student_id: string;
  resultUjian: ExamResult[];
  created_at: string[];
  fullName: string | null;
  classes: string | null;
};

export function useResultExamDataStudent(idTeacher: string | null) {
  const [resultExamsStudent, setResultExamsStudent] = useState<
    StudentExamResult[]
  >([]);

  useEffect(() => {
    if (!idTeacher) {
      setResultExamsStudent([]);
      return;
    }

    let isMounted = true;

    async function getDataStudent() {
      const [
        { data: students, error: studentsError },
        { data: historyStudents, error: historyStudentsError },
      ] = await Promise.all([
        supabase.from("account-student").select(`fullName, classes, idStudent`),

        supabase
          .from("history-exam-student")
          .select(
            `exam_id, student_id, hasil_ujian, status_exam, created_at, exams!inner (id, nama_ujian, tipeUjian, idTeacher)`,
          )
          .eq("exams.idTeacher", idTeacher),
      ]);

      if (studentsError || historyStudentsError) {
        console.error("Gagal mengambil data hasil ujian:", {
          studentsError,
          historyStudentsError,
        });

        return;
      }

      if (!isMounted) return;

      // =========================================================
      // Map data student agar lookup berdasarkan idStudent = O(1)
      // =========================================================

      const studentMap = new Map(
        (students ?? []).map((student) => [
          student.idStudent,
          {
            fullName: student.fullName,
            classes: student.classes,
          },
        ]),
      );

      // =========================================================
      // Group history berdasarkan student_id
      // =========================================================

      const studentResultMap = new Map<string, StudentExamResult>();

      (historyStudents ?? []).forEach((history) => {
        const exam = Array.isArray(history.exams)
          ? history.exams[0]
          : history.exams;

        if (!exam) return;

        const examResult: ExamResult = {
          namaUjian: exam.nama_ujian ?? null,
          idUjian: history.exam_id,
          tipe_ujian: exam.tipeUjian ?? null,
          hasil_ujian: history.hasil_ujian,
          status_exam: history.status_exam,
        };

        const existing = studentResultMap.get(history.student_id);

        if (existing) {
          existing.resultUjian.push(examResult);

          if (history.created_at) {
            existing.created_at.push(history.created_at);
          }
        } else {
          studentResultMap.set(history.student_id, {
            student_id: history.student_id,
            resultUjian: [examResult],
            created_at: history.created_at ? [history.created_at] : [],
            fullName: null,
            classes: null,
          });
        }
      });

      // =========================================================
      // Gabungkan history dengan data student
      // =========================================================

      const mergedData = Array.from(studentResultMap.values()).map(
        (student) => {
          const studentData = studentMap.get(student.student_id);

          return {
            ...student,
            fullName: studentData?.fullName ?? null,
            classes: studentData?.classes ?? null,
          };
        },
      );

      setResultExamsStudent(mergedData);
    }

    getDataStudent();

    return () => {
      isMounted = false;
    };
  }, [idTeacher]);

  return resultExamsStudent;
}
