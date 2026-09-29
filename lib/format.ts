const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const relativeFormatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return dateFormatter.format(new Date(date));
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  return dateTimeFormatter.format(new Date(date));
}

export function formatRelative(date: Date | string | null | undefined, now = new Date()) {
  if (!date) return "—";
  const diffSeconds = Math.round((new Date(date).getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diffSeconds);
  if (abs < 60) return "just now";
  if (abs < 3600) return relativeFormatter.format(Math.round(diffSeconds / 60), "minute");
  if (abs < 86400) return relativeFormatter.format(Math.round(diffSeconds / 3600), "hour");
  if (abs < 86400 * 7) return relativeFormatter.format(Math.round(diffSeconds / 86400), "day");
  return formatDate(date);
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
