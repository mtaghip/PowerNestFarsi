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
