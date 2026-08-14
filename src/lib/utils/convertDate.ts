const TIME_ZONE = "Asia/Jakarta";

export const getCurrentDate = () => new Date();

export function getDateKey(date: Date | string) {
  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export function getCurrentTimeInMinutes() {
  const now = getCurrentDate();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0,
  );
  return hour * 60 + minute;
}

export function toMinute(value: string) {
  const normalize = value.trim().replace(".", ":");

  const [hour, minute] = normalize.split(":").map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return NaN;
  }

  return hour * 60 + minute;
}

export function convertToNumber(tenggatWaktu: string) {
  const [start, end] = tenggatWaktu.split("-").map((item) => item.trim());

  return {
    start: toMinute(start),
    end: toMinute(end),
  };
}
