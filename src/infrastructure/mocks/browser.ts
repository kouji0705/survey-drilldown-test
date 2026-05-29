import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * ブラウザ用 MSW Service Worker。
 *
 * {@link enableMocking} から起動する。
 */
export const worker = setupWorker(...handlers);
