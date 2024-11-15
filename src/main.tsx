import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CanvasDrawing from "./canvas-drawing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CanvasDrawing />
  </StrictMode>
);
