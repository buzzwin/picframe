"use client";

import { useRef, useEffect, useState } from "react";

interface Frame {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
  size: "small" | "medium" | "large";
}

interface Layout {
  name: string;
  description: string;
  frames: Frame[];
  aestheticTips: string[];
}

interface FrameVisualizationProps {
  wallImage: string;
  layout: Layout;
  wallWidth: number;
  wallHeight: number;
}

export function FrameVisualization({
  wallImage,
  layout,
  wallWidth,
  wallHeight,
}: FrameVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const aspectRatio = wallHeight / wallWidth;
      const calculatedHeight = containerWidth * aspectRatio;

      setCanvasSize({
        width: containerWidth,
        height: Math.min(calculatedHeight, 600), // Max height of 600px
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [wallWidth, wallHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wallImage || canvasSize.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wall image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw semi-transparent overlay for better frame visibility
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frames
      layout.frames.forEach((frame, index) => {
        const x = (frame.x / 100) * canvas.width;
        const y = (frame.y / 100) * canvas.height;
        const width = (frame.width / wallWidth) * canvas.width;
        const height = (frame.height / wallHeight) * canvas.height;

        // Frame background
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(x, y, width, height);

        // Frame border
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Inner frame detail
        const innerPadding = Math.min(width, height) * 0.1;
        ctx.strokeStyle = "#666666";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          x + innerPadding,
          y + innerPadding,
          width - innerPadding * 2,
          height - innerPadding * 2
        );

        // Frame label
        ctx.fillStyle = "#000000";
        ctx.font = `${Math.max(
          12,
          Math.min(width, height) * 0.15
        )}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          `${frame.width}"×${frame.height}"`,
          x + width / 2,
          y + height / 2
        );

        // Frame number badge
        const badgeSize = Math.max(24, Math.min(width, height) * 0.2);
        ctx.fillStyle = getSizeColor(frame.size);
        ctx.beginPath();
        ctx.arc(
          x + badgeSize / 2 + 5,
          y + badgeSize / 2 + 5,
          badgeSize / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${badgeSize * 0.5}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          `${index + 1}`,
          x + badgeSize / 2 + 5,
          y + badgeSize / 2 + 5
        );
      });

      // Draw layout name
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillRect(10, 10, 250, 50);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 250, 50);

      ctx.fillStyle = "#000000";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(layout.name, 20, 20);

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#666666";
      ctx.fillText(`${layout.frames.length} frames`, 20, 40);
    };

    img.src = wallImage;
  }, [wallImage, layout, wallWidth, wallHeight, canvasSize]);

  const getSizeColor = (size: string) => {
    switch (size) {
      case "small":
        return "#3B82F6"; // blue
      case "medium":
        return "#8B5CF6"; // purple
      case "large":
        return "#EC4899"; // pink
      default:
        return "#6B7280"; // gray
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `frame-layout-${layout.name
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Frame Layout - ${layout.name}</title>
          <style>
            body { 
              margin: 0; 
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center; 
              min-height: 100vh;
              font-family: sans-serif;
            }
            img { 
              max-width: 100%; 
              height: auto; 
            }
            .info {
              margin: 20px;
              text-align: center;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="info">
            <h1>${layout.name}</h1>
            <p>${layout.description}</p>
            <p>Wall: ${wallWidth}" × ${wallHeight}" | Frames: ${layout.frames.length}</p>
          </div>
          <img src="${dataUrl}" alt="${layout.name}"/>
          <button class="no-print" onclick="window.print()" style="margin: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer;">
            Print
          </button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="w-full"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export Image
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Frame Legend</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700">Small</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-700">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-pink-500"></div>
            <span className="text-sm text-gray-700">Large</span>
          </div>
        </div>
      </div>
    </div>
  );
}
