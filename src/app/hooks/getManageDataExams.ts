import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export function useManageDataExams(getidTeacher: string, page: number) {
  const [dataManageExams, setDataManageExams] = useState<any[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!getidTeacher) {
      setDataManageExams([]);
      setTotalData(0);
      return;
    }

    let isMounted = true;

    async function getDataManageExams() {
      setIsLoading(true);

      try {
        // =====================================================
        // 1. Hitung offset
        // =====================================================

        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // =====================================================
        // 2. Ambil managed exams + total data
        // =====================================================

        const {
          data: managedExams,
          error: managedExamsError,
          count,
        } = await supabase
          .from("managed_exams")
          .select(
            `kelas, dibuat_tgl, tenggat_waktu, idExams, exams(nama_ujian)`,
            { count: "exact" },
          )
          .eq("id_Teacher", getidTeacher)
          .order("dibuat_tgl", {
            ascending: false,
          })
          .range(from, to);

        if (managedExamsError) {
          console.error("managedExams ERROR:", managedExamsError);

          return;
        }

        if (!isMounted) return;

        setTotalData(count ?? 0);

        // Tidak ada data pada halaman tersebut
        if (!managedExams?.length) {
          setDataManageExams([]);
          return;
        }

        // =====================================================
        // 3. Ambil ID exam dari halaman saat ini
        // =====================================================

        const examIds = managedExams
          .map((exam) => exam.idExams)
          .filter(Boolean);

        // =====================================================
        // 4. Ambil history + student secara paralel
        // =====================================================

        const [
          { data: historyExams, error: historyExamsError },
          { data: students, error: studentsError },
        ] = await Promise.all([
          supabase
            .from("history-exam-student")
            .select(
              `exam_id, student_id, kelas, hasil_ujian, status_exam, exams!inner(idTeacher)`,
            )
            .eq("exams.idTeacher", getidTeacher)
            .in("exam_id", examIds),

          supabase.from("account-student").select("classes, idStudent"),
        ]);

        if (historyExamsError) {
          console.error("historyExams ERROR:", historyExamsError);

          return;
        }

        if (studentsError) {
          console.error("students ERROR:", studentsError);

          return;
        }

        if (!isMounted) return;

        // =====================================================
        // 5. Map history berdasarkan kelas + exam
        // =====================================================

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

        // =====================================================
        // 6. Map student berdasarkan kelas
        // =====================================================

        const studentMap = new Map<string, string[]>();

        students?.forEach((student) => {
          const existingStudents = studentMap.get(student.classes) ?? [];

          existingStudents.push(student.idStudent);

          studentMap.set(student.classes, existingStudents);
        });

        // =====================================================
        // 7. Merge data
        // =====================================================

        const mergedData = managedExams.map((exam) => {
          const key = `${exam.kelas}_${exam.idExams}`;

          const examHistory = completeExamMap.get(key);

          const classStudents = studentMap.get(exam.kelas) ?? [];

          return {
            ...exam,

            lengthStudent: classStudents,

            lengthStudentCompleteExams: examHistory?.studentIds ?? [],

            hasil_ujian: examHistory?.hasilUjian ?? [],
          };
        });

        setDataManageExams(mergedData);
      } catch (error) {
        console.error("Gagal mengambil data manage exams:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    getDataManageExams();

    return () => {
      isMounted = false;
    };
  }, [getidTeacher, page]);

  return {
    dataManageExams,
    totalData,
    isLoading,
    pageSize: PAGE_SIZE,
  };
}
