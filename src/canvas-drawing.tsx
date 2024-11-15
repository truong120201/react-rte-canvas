// src/CanvasDrawing.tsx
import { MouseEvent, useEffect, useRef, useState } from "react";

interface CanvasDrawingProps {
  width?: number;
  height?: number;
}

const CanvasDrawing: React.FC<CanvasDrawingProps> = ({
  width = 600,
  height = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState("#333333");
  const [lineWidth, setLineWidth] = useState(2);
  const [drawing, setDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  // Save the current canvas state
  const saveState = () => {
    if (canvasRef.current) {
      setUndoStack((prev) => [...prev, canvasRef.current!.toDataURL()]);
    }
  };

  // Undo the last drawing action
  const undo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop();
      const img = new Image();
      img.src = lastState!;
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  };

  // Start drawing when mouse is pressed
  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    saveState();
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  // Draw as mouse moves
  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  // Stop drawing
  const stopDrawing = () => {
    setDrawing(false);
  };

  // Clear the canvas
  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      setUndoStack([]);
    }
  };

  // Handle keyboard events for undo (Ctrl + Z)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault(); // Prevent default behavior of the browser
        undo();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [undoStack]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <label>
          Line Width:
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
        </label>
        <button onClick={clearCanvas}>Clear Canvas</button>
        <button onClick={undo}>Undo</button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: "2px solid #333",
          backgroundColor: "#fff",
          cursor: "crosshair",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default CanvasDrawing;
