import type { RepeatItem } from "../../types/survey";

export const MAX_REPEAT = 10;

export const emptyRepeatItem = (): RepeatItem => ({
  field_a: "",
  field_b: "",
  field_c: "",
});

export const parseRepeatCount = (value: unknown): number => {
  if (value === "" || value === undefined || value === null) return 0;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(Math.floor(n), MAX_REPEAT);
};
