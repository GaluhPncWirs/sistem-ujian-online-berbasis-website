import { supabase } from "@/lib/supabase/data";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useDataNameExams(id: string | undefined) {
  const [nameExams, setNameExams] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    async function handleNameExams() {
      const { data: examsCollections, error: examsError } = await supabase
        .from("exams")
        .select("nama_ujian, tipeUjian")
        .eq("idTeacher", id);
      if (examsError) {
        toast("Gagal ❌", {
          description: "data gagal ditampilkan:",
        });
        setNameExams([]);
        return;
      }

      setNameExams(examsCollections ?? []);
    }
    handleNameExams();
  }, [id]);

  return nameExams;
}
