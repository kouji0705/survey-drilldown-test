/**
 * 繰り返し設問（repeat）に関するドメインユーティリティ。
 */

/**
 * テンプレート定義から、空の1セット分オブジェクトを生成する。
 *
 * `useFieldArray.replace` でセット追加するときの初期値に使う。
 *
 * @param template - repeat フィールドの `template`
 * @returns 各子フィールド名をキーにした空文字のオブジェクト
 */
export const emptyRepeatItemFromTemplate = (
  template: { name: string }[],
): Record<string, string> =>
  Object.fromEntries(template.map((t) => [t.name, ""]));

/**
 * 件数入力値を、有効な繰り返しセット数（0〜max）に正規化する。
 *
 * @param value - 件数フィールドの生の値（未入力・NaN あり）
 * @param maxRepeat - `options.repeat.*.maxCount`
 * @returns 有効な件数。未入力・不正・1未満は `0`
 */
export const parseRepeatCount = (value: unknown, maxRepeat: number): number => {
  if (value === "" || value === undefined || value === null) return 0;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(Math.floor(n), maxRepeat);
};
