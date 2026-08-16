import { convertToNumber, getCurrentTimeInMinutes } from "./convertDate";

const MONTHS_ID: Record<string, number> = {
  Januari: 0,
  Februari: 1,
  Maret: 2,
  April: 3,
  Mei: 4,
  Juni: 5,
  Juli: 6,
  Agustus: 7,
  September: 8,
  Oktober: 9,
  November: 10,
  Desember: 11,
};

export function parseIndonesianDate(dateString: string) {
  const [day, month, year] = dateString.trim().split(" ");

  const monthIndex = MONTHS_ID[month];

  if (!day || !year || monthIndex === undefined) {
    return null;
  }

  return {
    day: Number(day),
    month: monthIndex,
    year: Number(year),
  };
}

export function getTodayIndonesia() {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const parts = formatter.formatToParts(new Date());

  return {
    day: Number(parts.find((part) => part.type === "day")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value) - 1,
    year: Number(parts.find((part) => part.type === "year")?.value),
  };
}

type ExamStatus = "BELUM_MULAI" | "BERLANGSUNG" | "LEWAT";

export function getExamStatus(
  tenggatWaktu: string,
  tglUjian: string,
): ExamStatus {
  const { start, end } = convertToNumber(tenggatWaktu);

  const examDate = parseIndonesianDate(tglUjian);
  const today = getTodayIndonesia();

  if (!examDate || Number.isNaN(start) || Number.isNaN(end)) {
    return "LEWAT";
  }

  const examDateNumber =
    examDate.year * 10000 + (examDate.month + 1) * 100 + examDate.day;

  const todayNumber = today.year * 10000 + (today.month + 1) * 100 + today.day;

  const currentMinute = getCurrentTimeInMinutes();

  // Ujian di hari yang akan datang
  if (examDateNumber > todayNumber) {
    return "BELUM_MULAI";
  }

  // Ujian di hari yang sudah lewat
  if (examDateNumber < todayNumber) {
    return "LEWAT";
  }

  // Ujian hari ini
  if (currentMinute < start) {
    return "BELUM_MULAI";
  }

  if (currentMinute >= end) {
    return "LEWAT";
  }

  return "BERLANGSUNG";
}
