export const money = (value) => `${Number(value || 0).toFixed(1)} LPA`;

export const shortDate = (value) => (value ? new Date(value).toLocaleDateString() : "-");

export const getName = (value, fallback = "-") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.name || value.companyName || value.roundName || fallback;
};
