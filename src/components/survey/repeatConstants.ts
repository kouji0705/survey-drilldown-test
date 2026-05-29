export const emptyRepeatItemFromTemplate = (
  template: { name: string }[],
): Record<string, string> =>
  Object.fromEntries(template.map((t) => [t.name, ""]));

export const parseRepeatCount = (value: unknown, maxRepeat: number): number => {
  if (value === "" || value === undefined || value === null) return 0;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(Math.floor(n), maxRepeat);
};
