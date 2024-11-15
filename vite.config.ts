import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    lib: {
      entry: "src/canvas-drawing.tsx",
      name: "CanvasDrawing",
      fileName: (format) =>
        format === "es" ? "canvas-drawing.es.js" : "canvas-drawing.cjs.js",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
