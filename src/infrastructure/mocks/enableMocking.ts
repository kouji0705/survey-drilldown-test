/**
 * 開発環境で MSW を起動する。
 *
 * 本番ビルド（`import.meta.env.DEV === false`）では何もしない。
 *
 * @returns `worker.start()` の Promise（dev のみ）
 */
export async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}
