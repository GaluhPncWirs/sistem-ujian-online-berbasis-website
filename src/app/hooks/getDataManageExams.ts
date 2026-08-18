import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

export function useManageExams(getidTeacher: string, page: number) {
  const [manageExams, setManageExams] = useState<any[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!getidTeacher) {
      setManageExams([]);
      setTotalData(0);
      return;
    }

    let isMounted = true;

    async function getDataManageExams() {
      setIsLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      try {
        const { data, error, count } = await supabase
          .from("exams")
          .select("id, nama_ujian, tipeUjian", {
            count: "exact",
          })
          .eq("idTeacher", getidTeacher)
          .order("created_at_exams", {
            ascending: false,
          })
          .range(from, to);

        if (error) {
          console.error("manageExams ERROR:", error);

          if (isMounted) {
            setManageExams([]);
            setTotalData(0);
          }

          return;
        }

        if (!isMounted) return;

        setManageExams(data ?? []);
        setTotalData(count ?? 0);
      } catch (error) {
        console.error("Gagal mengambil data manage exams:", error);

        if (isMounted) {
          setManageExams([]);
          setTotalData(0);
        }
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
    manageExams,
    totalData,
    isLoading,
    pageSize: PAGE_SIZE,
  };
}
