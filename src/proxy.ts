import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./lib/supabase/data";
import { jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isStartExam = req.cookies.get("startExam")?.value;
  const token = req.cookies.get("tokenLogin")?.value;

  if (pathname.startsWith("/Student/Exams/StartExam")) {
    const examId = pathname.split("/")[4];

    if (!examId) {
      return NextResponse.redirect(new URL("/Student/Dashboard", req.url));
    }

    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const idStudent = payload.idStudent;

      // Validasi apakah ujian dan siswa valid
      const [{ data: isExamNone }, { data: isIdStudentNone }] =
        await Promise.all([
          supabase
            .from("exams")
            .select("id,nama_ujian")
            .eq("id", examId)
            .single(),
          supabase
            .from("account-student")
            .select("fullName, idStudent")
            .eq("idStudent", idStudent)
            .single(),
        ]);

      if (isExamNone === null || isIdStudentNone === null) {
        return NextResponse.redirect(new URL("/Student/Dashboard", req.url));
      }

      // Cek apakah siswa sudah pernah ujian
      const { data: examHistory }: any = await supabase
        .from("history-exam-student")
        .select("status_exam,student_id,hasil_ujian")
        .eq("exam_id", examId)
        .eq("student_id", idStudent)
        .single();

      // Jika belum ada history ujian maka set cookie untuk mulai
      if (!examHistory?.status_exam && !examHistory?.student_id) {
        const response = NextResponse.next();
        response.cookies.set("startExam", "true", {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
        });
        response.cookies.set("examId", examId, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
        });
        return response;
      }

      // Jika ujian sudah selesai atau telat
      if (
        examHistory.status_exam === true &&
        examHistory.student_id === idStudent &&
        (examHistory.hasil_ujian === "telat" || true)
      ) {
        return NextResponse.redirect(new URL("/Student/Dashboard", req.url));
      }
    }

    // Jika belum startExam set cookie
    if (isStartExam !== "true") {
      const response = NextResponse.next();
      response.cookies.set("startExam", "true", {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });
      return response;
    }

    // Pastikan URL konsisten
    const expectedUrl = `/Student/Exams/StartExam?idExams=${examId}`;
    const currentUrl = pathname + req.nextUrl.search;
    if (isStartExam === "true" && currentUrl !== expectedUrl) {
      return NextResponse.redirect(new URL(expectedUrl, req.url));
    }

    return NextResponse.next();
  }

  // Blokir Navigasi Saat Ujian Sedang Berlangsung
  if (
    isStartExam === "true" &&
    pathname.startsWith("/Student") &&
    !pathname.startsWith("/Student/Exams/StartExam")
  ) {
    const examId = req.cookies.get("examId")?.value;

    if (examId) {
      return NextResponse.redirect(
        new URL(`/Student/Exams/StartExam?idExams=${examId}`, req.url),
      );
    }

    return NextResponse.redirect(new URL("/Student/Dashboard", req.url));
  }

  // proteksi halaman
  if (token) {
    // proteksi halaman guru
    const decodeJWT: any = jwtDecode(token);
    if (pathname.startsWith("/Teacher") && decodeJWT.role !== "pengajar") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    //proteksi halaman pelajar
    if (pathname.startsWith("/Student") && decodeJWT.role !== "pelajar") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // //proteksi jika belum login
  // if (pathname.startsWith("/Teacher") && !token) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Teacher/:path*", "/Student/:path*", "/api/:path*"],
};
