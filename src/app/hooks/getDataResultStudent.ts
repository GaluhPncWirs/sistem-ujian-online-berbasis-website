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

const PAGE_SIZE = 5;

export function useResultExamDataStudent(
  idTeacher: string | null,
  page: number,
) {
  const [resultExamsStudent, setResultExamsStudent] = useState<
    StudentExamResult[]
  >([]);

  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!idTeacher) {
      setResultExamsStudent([]);
      setTotalData(0);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function getDataStudent() {
      setIsLoading(true);

      try {
        // =====================================================
        // 1. Hitung pagination
        // =====================================================

        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // =====================================================
        // 2. Ambil student berdasarkan pagination
        // =====================================================

        const {
          data: students,
          error: studentsError,
          count,
        } = await supabase
          .from("account-student")
          .select("fullName, classes, idStudent", {
            count: "exact",
          })
          .order("fullName", {
            ascending: true,
          })
          .range(from, to);

        if (studentsError) {
          console.error("students ERROR:", studentsError);

          return;
        }

        if (!isMounted) return;

        setTotalData(count ?? 0);

        // Tidak ada student
        if (!students?.length) {
          setResultExamsStudent([]);
          return;
        }

        // =====================================================
        // 3. Ambil ID student pada halaman ini
        // =====================================================

        const studentIds = students
          .map((student) => student.idStudent)
          .filter(Boolean);

        // =====================================================
        // 4. Ambil history hanya untuk student tersebut
        // =====================================================

        const { data: historyStudents, error: historyStudentsError } =
          await supabase
            .from("history-exam-student")
            .select(
              `
              exam_id,
              student_id,
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
            .in("student_id", studentIds);

        if (historyStudentsError) {
          console.error("historyStudents ERROR:", historyStudentsError);

          return;
        }

        if (!isMounted) return;

        // =====================================================
        // 5. Map student
        // =====================================================

        const studentMap = new Map(
          students.map((student) => [
            student.idStudent,
            {
              fullName: student.fullName,
              classes: student.classes,
            },
          ]),
        );

        // =====================================================
        // 6. Group history berdasarkan student
        // =====================================================

        const studentResultMap = new Map<string, StudentExamResult>();

        // =====================================================
        // 7. Inisialisasi semua student
        //    termasuk student yang belum punya history
        // =====================================================

        students.forEach((student) => {
          studentResultMap.set(student.idStudent, {
            student_id: student.idStudent,
            resultUjian: [],
            created_at: [],
            fullName: student.fullName ?? null,
            classes: student.classes ?? null,
          });
        });

        // =====================================================
        // 8. Masukkan history ke student
        // =====================================================

        (historyStudents ?? []).forEach((history) => {
          const exam = Array.isArray(history.exams)
            ? history.exams[0]
            : history.exams;

          if (!exam) return;

          const student = studentResultMap.get(history.student_id);

          if (!student) return;

          const examResult: ExamResult = {
            namaUjian: exam.nama_ujian ?? null,

            idUjian: history.exam_id,

            tipe_ujian: exam.tipeUjian ?? null,

            hasil_ujian: history.hasil_ujian,

            status_exam: history.status_exam,
          };

          student.resultUjian.push(examResult);

          if (history.created_at) {
            student.created_at.push(history.created_at);
          }
        });

        // =====================================================
        // 9. Convert Map → Array
        // =====================================================

        const mergedData = Array.from(studentResultMap.values());

        setResultExamsStudent(mergedData);
      } catch (error) {
        console.error("Gagal mengambil data hasil ujian:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    getDataStudent();

    return () => {
      isMounted = false;
    };
  }, [idTeacher, page]);

  return {
    resultExamsStudent,
    totalData,
    isLoading,
    pageSize: PAGE_SIZE,
  };
}
