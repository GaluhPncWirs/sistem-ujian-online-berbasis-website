import {
  convertToNumber,
  getCurrentTimeInMinutes,
} from "@/lib/utils/convertDate";
import { getTodayIndonesia, parseIndonesianDate } from "@/lib/utils/statusExam";

type ExamSchedule = {
  status_exam: boolean;
  dibuat_tgl: string;
  tenggat_waktu: string;
};

export function getUpComingExam(scheduleExams: any) {
  const today = getTodayIndonesia();
  const currentMinute = getCurrentTimeInMinutes();

  const todayNumber = today.year * 10000 + (today.month + 1) * 100 + today.day;

  const upcomingExams: ExamSchedule[] = scheduleExams.filter(
    (exam: ExamSchedule) => {
      // Sudah mengerjakan ujian
      if (exam.status_exam === true) {
        return false;
      }

      const examDate = parseIndonesianDate(exam.dibuat_tgl);

      if (!examDate) {
        return false;
      }

      const examDateNumber =
        examDate.year * 10000 + (examDate.month + 1) * 100 + examDate.day;

      // Hanya ujian hari ini
      if (examDateNumber !== todayNumber) {
        return false;
      }

      const { start, end } = convertToNumber(exam.tenggat_waktu);

      if (Number.isNaN(start) || Number.isNaN(end)) {
        return false;
      }

      // Sudah melewati deadline
      if (currentMinute >= end) {
        return false;
      }

      // Belum mulai atau sedang berlangsung
      return true;
    },
  );

  if (upcomingExams.length === 0) {
    return null;
  }

  return upcomingExams.reduce(
    (closestExam: ExamSchedule, currentExam: ExamSchedule) => {
      const closestDeadline = convertToNumber(closestExam.tenggat_waktu).end;

      const currentDeadline = convertToNumber(currentExam.tenggat_waktu).end;

      return currentDeadline < closestDeadline ? currentExam : closestExam;
    },
  );
}
