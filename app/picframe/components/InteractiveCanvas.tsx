"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Frame {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
  size: "small" | "medium" | "large";
  placementReason?: string;
}

interface Layout {
  name: string;
  description: string;
  frames: Frame[];
  aestheticTips: string[];
}

interface InteractiveCanvasProps {
  wallImage: string;
  layout: Layout;
  wallWidth: number;
  wallHeight: number;
  onFramesUpdate?: (frames: Frame[]) => void;
  selectedFrameId?: string | null;
  onSelectFrame?: (frameId: string | null) => void;
}

interface DragState {
  isDragging: boolean;
  dragFrameId: string | null;
  dragOffset: { x: number; y: number };
}

export function InteractiveCanvas({
  wallImage,
  layout,
  wallWidth,
  wallHeight,
  onFramesUpdate,
  selectedFrameId,
  onSelectFrame,
}: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [frames, setFrames] = useState<Frame[]>(layout.frames);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragFrameId: null,
    dragOffset: { x: 0, y: 0 },
  });
  const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);

  // Grid settings
  const gridSize = 20; // pixels per grid cell
  const snapToGrid = true;

  // Common obstacle zones (would be detected by AI in real usage)
  const obstacleZones = [
    // Top 10% - often has moldings, outlets near ceiling
    { x: 0, y: 0, width: 100, height: 10 },
    // Bottom 15% - furniture, baseboards, outlets
    { x: 0, y: 85, width: 100, height: 15 },
    // Left edge 5% - doorways, corners
    { x: 0, y: 0, width: 5, height: 100 },
    // Right edge 5% - doorways, corners
    { x: 95, y: 0, width: 5, height: 100 },
  ];

  useEffect(() => {
    setFrames(layout.frames);
  }, [layout.frames]);

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const aspectRatio = wallHeight / wallWidth;
      const calculatedHeight = containerWidth * aspectRatio;

      // On mobile, use full available height minus safe areas
      const maxHeight = window.innerHeight * 0.6;
      const finalHeight = Math.min(calculatedHeight, maxHeight);
      const finalWidth = finalHeight / aspectRatio;

      setCanvasSize({ width: finalWidth, height: finalHeight });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [wallWidth, wallHeight]);

  // Convert percentage coordinates to canvas pixels
  const percentageToPixels = useCallback(
    (percentage: number, dimension: "x" | "y") => {
      return (
        (percentage / 100) *
        (dimension === "x" ? canvasSize.width : canvasSize.height)
      );
    },
    [canvasSize]
  );

  // Convert canvas pixels to percentage coordinates
  const pixelsToPercentage = useCallback(
    (pixels: number, dimension: "x" | "y") => {
      return (
        (pixels / (dimension === "x" ? canvasSize.width : canvasSize.height)) *
        100
      );
    },
    [canvasSize]
  );

  // Check if position conflicts with obstacle zones
  const isPositionSafe = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const frameLeft = (x / canvasSize.width) * 100;
      const frameRight = frameLeft + (width / wallWidth) * 100;
      const frameTop = (y / canvasSize.height) * 100;
      const frameBottom = frameTop + (height / wallHeight) * 100;

      for (const obstacle of obstacleZones) {
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleBottom = obstacle.y + obstacle.height;

        // Check for overlap with safety margin
        if (
          frameLeft < obstacleRight + 2 &&
          frameRight > obstacle.x - 2 &&
          frameTop < obstacleBottom + 2 &&
          frameBottom > obstacle.y - 2
        ) {
          return false;
        }
      }

      // Ensure frames are within safe viewing height (15-85% of wall height)
      if (frameTop < 15 || frameBottom > 85) {
        return false;
      }

      return true;
    },
    [canvasSize, wallWidth, wallHeight, obstacleZones]
  );

  // Snap to grid
  const snapToGridPosition = useCallback(
    (x: number, y: number) => {
      if (!snapToGrid) return { x, y };

      const snappedX = Math.round(x / gridSize) * gridSize;
      const snappedY = Math.round(y / gridSize) * gridSize;

      return {
        x: Math.max(0, Math.min(snappedX, canvasSize.width)),
        y: Math.max(0, Math.min(snappedY, canvasSize.height)),
      };
    },
    [canvasSize, gridSize]
  );

  // Check if point is inside frame
  const isPointInFrame = useCallback(
    (pointX: number, pointY: number, frame: Frame) => {
      const frameX = percentageToPixels(frame.x, "x");
      const frameY = percentageToPixels(frame.y, "y");
      const frameWidth = percentageToPixels(
        (frame.width / wallWidth) * 100,
        "x"
      );
      const frameHeight = percentageToPixels(
        (frame.height / wallHeight) * 100,
        "y"
      );

      return (
        pointX >= frameX &&
        pointX <= frameX + frameWidth &&
        pointY >= frameY &&
        pointY <= frameY + frameHeight
      );
    },
    [percentageToPixels, wallWidth, wallHeight]
  );

  // Get frame at point
  const getFrameAtPoint = useCallback(
    (x: number, y: number) => {
      // Check frames in reverse order (top to bottom)
      for (let i = frames.length - 1; i >= 0; i--) {
        if (isPointInFrame(x, y, frames[i])) {
          return frames[i];
        }
      }
      return null;
    },
    [frames, isPointInFrame]
  );

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const frame = getFrameAtPoint(x, y);
      if (frame) {
        // Select frame first
        if (onSelectFrame) {
          onSelectFrame(frame.id);
        }

        const frameX = percentageToPixels(frame.x, "x");
        const frameY = percentageToPixels(frame.y, "y");

        setDragState({
          isDragging: true,
          dragFrameId: frame.id,
          dragOffset: {
            x: x - frameX,
            y: y - frameY,
          },
        });
      } else {
        // Clicked on empty space, deselect
        if (onSelectFrame) {
          onSelectFrame(null);
        }
      }
    },
    [getFrameAtPoint, percentageToPixels]
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (dragState.isDragging && dragState.dragFrameId) {
        // Calculate new position
        const newX = x - dragState.dragOffset.x;
        const newY = y - dragState.dragOffset.y;

        // Snap to grid
        const snapped = snapToGridPosition(newX, newY);

        // Convert to percentage
        const newPercentageX = pixelsToPercentage(snapped.x, "x");
        const newPercentageY = pixelsToPercentage(snapped.y, "y");

        // Check if the new position is safe (doesn't conflict with obstacles)
        const frame = frames.find((f) => f.id === dragState.dragFrameId);
        if (
          frame &&
          isPositionSafe(snapped.x, snapped.y, frame.width, frame.height)
        ) {
          // Update frame position
          setFrames((prevFrames) =>
            prevFrames.map((frame) =>
              frame.id === dragState.dragFrameId
                ? { ...frame, x: newPercentageX, y: newPercentageY }
                : frame
            )
          );
        }
      } else {
        // Check for hover
        const frame = getFrameAtPoint(x, y);
        setHoveredFrame(frame?.id || null);
      }
    },
    [dragState, snapToGridPosition, pixelsToPercentage, getFrameAtPoint]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        dragFrameId: null,
        dragOffset: { x: 0, y: 0 },
      });

      // Notify parent of frame updates
      if (onFramesUpdate) {
        onFramesUpdate(frames);
      }
    }
  }, [dragState.isDragging, onFramesUpdate, frames]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wallImage || canvasSize.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw wall image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);

      // Draw grid
      if (snapToGrid) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 1;

        for (let x = 0; x <= canvasSize.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvasSize.height);
          ctx.stroke();
        }

        for (let y = 0; y <= canvasSize.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvasSize.width, y);
          ctx.stroke();
        }
      }

      // Draw obstacle zones
      ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
      ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
      ctx.lineWidth = 1;

      for (const obstacle of obstacleZones) {
        const obstacleX = (obstacle.x / 100) * canvasSize.width;
        const obstacleY = (obstacle.y / 100) * canvasSize.height;
        const obstacleWidth = (obstacle.width / 100) * canvasSize.width;
        const obstacleHeight = (obstacle.height / 100) * canvasSize.height;

        ctx.fillRect(obstacleX, obstacleY, obstacleWidth, obstacleHeight);
        ctx.strokeRect(obstacleX, obstacleY, obstacleWidth, obstacleHeight);

        // Add label
        ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          "AVOID",
          obstacleX + obstacleWidth / 2,
          obstacleY + obstacleHeight / 2
        );
        ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
      }

      // Draw frames
      frames.forEach((frame, index) => {
        const frameX = percentageToPixels(frame.x, "x");
        const frameY = percentageToPixels(frame.y, "y");
        const frameWidth = percentageToPixels(
          (frame.width / wallWidth) * 100,
          "x"
        );
        const frameHeight = percentageToPixels(
          (frame.height / wallHeight) * 100,
          "y"
        );

        // Frame background
        const isSelected = selectedFrameId === frame.id;
        const isHovered = hoveredFrame === frame.id;

        if (isSelected) {
          ctx.fillStyle = "rgba(147, 51, 234, 0.3)";
        } else if (isHovered) {
          ctx.fillStyle = "rgba(147, 51, 234, 0.2)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        }
        ctx.fillRect(frameX, frameY, frameWidth, frameHeight);

        // Frame border
        if (isSelected) {
          ctx.strokeStyle = "#9333ea";
          ctx.lineWidth = 4;
        } else if (isHovered) {
          ctx.strokeStyle = "#9333ea";
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 2;
        }
        ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

        // Frame label
        ctx.fillStyle = "#374151";
        ctx.font = "12px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `${frame.size} ${frame.orientation}`,
          frameX + frameWidth / 2,
          frameY + frameHeight / 2
        );

        // Frame ID
        ctx.fillStyle = "#6b7280";
        ctx.font = "10px Inter, sans-serif";
        ctx.fillText(
          frame.id,
          frameX + frameWidth / 2,
          frameY + frameHeight / 2 + 15
        );
      });
    };
    img.src = wallImage;
  }, [
    wallImage,
    canvasSize,
    frames,
    hoveredFrame,
    selectedFrameId,
    percentageToPixels,
    wallWidth,
    wallHeight,
    gridSize,
    snapToGrid,
  ]);

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-semibold text-blue-800">Interactive Canvas</h3>
        </div>
        <p className="text-sm text-blue-700">
          Drag frames around to customize your layout. Frames will snap to the
          grid for precise positioning. Red zones indicate areas to avoid
          (outlets, doorways, etc.).
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full flex justify-center"
        style={{ minHeight: "400px" }}
      >
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded-lg shadow-lg cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {frames.map((frame) => (
          <div
            key={frame.id}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              hoveredFrame === frame.id
                ? "bg-purple-100 text-purple-800 border border-purple-300"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}
          >
            {frame.id}: {frame.size} {frame.orientation}
          </div>
        ))}
      </div>
    </div>
  );
}
