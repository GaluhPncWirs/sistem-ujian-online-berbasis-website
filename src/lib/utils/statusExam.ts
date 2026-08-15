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
