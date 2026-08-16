import { supabase } from "@/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      idExam: string;
      idStudent: string;
    }>;
  },
) {
  const { idExam, idStudent } = await context.params;

  const { data: dataStudent, error: errDataStudent } = await supabase
    .from("account-student")
    .select("idStudent, classes")
    .eq("idStudent", idStudent)
    .single();

  if (errDataStudent) {
    return NextResponse.json({
      status: 401,
      success: false,
      message: "Data Gagal di Ambil",
    });
  } else {
    const { data: dataExams, error: errDataExams }: any = await supabase
      .from("managed_exams")
      .select("*,exams(questions_exam,nama_ujian)")
      .eq("idExams", Number(idExam))
      .eq("kelas", dataStudent.classes)
      .single();

    if (errDataExams) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Data Gagal di Ambil",
        dataExams: [],
        dataStudent: [],
      });
    } else {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Data Berhasil di Ambil",
        dataExams: dataExams,
        dataStudent: dataStudent,
      });
    }
  }
}
