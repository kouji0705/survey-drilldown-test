import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { enableMocking } from "@infrastructure/mocks/enableMocking";
import "../index.css";
import App from "./App.tsx";

/**
 * アプリケーションエントリポイント。
 *
 * 1. 開発時のみ MSW を起動
 * 2. React を `#root` にマウント
 */
async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
