import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { enableMocking } from "./mocks/enableMocking";
import "./index.css";
import App from "./App.tsx";

async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
