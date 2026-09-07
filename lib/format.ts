const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function fa(n: number): string {
  return Math.round(n).toLocaleString("fa-IR");
}

export function faDec(n: number, d = 1): string {
  return n.toFixed(d).replace(/\d/g, (c) => FA_DIGITS[Number(c)]);
}

export function faNum(n: number): string {
  return n.toLocaleString("fa-IR");
}

export function stars(rating: number): string {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

/**
 * Jalali date and time for the admin panel. The timezone is pinned to Tehran
 * rather than left to the server, which runs in UTC — an enquiry that arrived
 * at 1am local time would otherwise be shown as the previous evening.
 */
export function faDateTime(d: Date): string {
  return d.toLocaleString("fa-IR", {
    timeZone: "Asia/Tehran",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
