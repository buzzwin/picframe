"use client";

import { useState } from "react";

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

interface FramePaletteProps {
  frames: Frame[];
  onAddFrame: (frame: Omit<Frame, "id" | "x" | "y">) => void;
  onDeleteFrame: (frameId: string) => void;
  onUpdateFrame: (frameId: string, updates: Partial<Frame>) => void;
  selectedFrameId?: string | null;
  onSelectFrame: (frameId: string | null) => void;
}

const FRAME_TEMPLATES = [
  {
    size: "small" as const,
    orientation: "portrait" as const,
    width: 8,
    height: 10,
    label: "Small Portrait",
    icon: "📱",
  },
  {
    size: "small" as const,
    orientation: "landscape" as const,
    width: 10,
    height: 8,
    label: "Small Landscape",
    icon: "📱",
  },
  {
    size: "medium" as const,
    orientation: "portrait" as const,
    width: 12,
    height: 16,
    label: "Medium Portrait",
    icon: "🖼️",
  },
  {
    size: "medium" as const,
    orientation: "landscape" as const,
    width: 16,
    height: 12,
    label: "Medium Landscape",
    icon: "🖼️",
  },
  {
    size: "large" as const,
    orientation: "portrait" as const,
    width: 16,
    height: 20,
    label: "Large Portrait",
    icon: "🖼️",
  },
  {
    size: "large" as const,
    orientation: "landscape" as const,
    width: 20,
    height: 16,
    label: "Large Landscape",
    icon: "🖼️",
  },
];

export function FramePalette({
  frames,
  onAddFrame,
  onDeleteFrame,
  onUpdateFrame,
  selectedFrameId,
  onSelectFrame,
}: FramePaletteProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddFrame = (template: (typeof FRAME_TEMPLATES)[0]) => {
    onAddFrame({
      width: template.width,
      height: template.height,
      orientation: template.orientation,
      size: template.size,
    });
  };

  const handleDeleteFrame = (frameId: string) => {
    onDeleteFrame(frameId);
    if (selectedFrameId === frameId) {
      onSelectFrame(null);
    }
  };

  const handleSizeChange = (
    frameId: string,
    newSize: "small" | "medium" | "large"
  ) => {
    const template = FRAME_TEMPLATES.find(
      (t) =>
        t.size === newSize &&
        t.orientation === frames.find((f) => f.id === frameId)?.orientation
    );
    if (template) {
      onUpdateFrame(frameId, {
        width: template.width,
        height: template.height,
        size: template.size,
      });
    }
  };

  const handleOrientationChange = (
    frameId: string,
    newOrientation: "landscape" | "portrait"
  ) => {
    const frame = frames.find((f) => f.id === frameId);
    if (frame) {
      const template = FRAME_TEMPLATES.find(
        (t) => t.size === frame.size && t.orientation === newOrientation
      );
      if (template) {
        onUpdateFrame(frameId, {
          width: template.width,
          height: template.height,
          orientation: template.orientation,
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="font-semibold text-gray-800">Frame Palette</h3>
          <span className="text-sm text-gray-500">
            ({frames.length} frames)
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Add Frame Templates */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Add New Frame
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {FRAME_TEMPLATES.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleAddFrame(template)}
                  className="flex items-center gap-2 p-2 text-xs border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <span className="text-lg">{template.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">
                      {template.label}
                    </div>
                    <div className="text-gray-500">
                      {template.width}" × {template.height}"
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Existing Frames */}
          {frames.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Manage Frames
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {frames.map((frame) => (
                  <div
                    key={frame.id}
                    className={`p-3 border rounded-lg transition-colors ${
                      selectedFrameId === frame.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {frame.size === "small"
                            ? "📱"
                            : frame.size === "medium"
                            ? "🖼️"
                            : "🖼️"}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {frame.id}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteFrame(frame.id)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Size Selector */}
                      <div>
                        <label className="block text-gray-600 mb-1">Size</label>
                        <select
                          value={frame.size}
                          onChange={(e) =>
                            handleSizeChange(
                              frame.id,
                              e.target.value as "small" | "medium" | "large"
                            )
                          }
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>

                      {/* Orientation Selector */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Orientation
                        </label>
                        <select
                          value={frame.orientation}
                          onChange={(e) =>
                            handleOrientationChange(
                              frame.id,
                              e.target.value as "landscape" | "portrait"
                            )
                          }
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      {frame.width}" × {frame.height}" • {Math.round(frame.x)}%,{" "}
                      {Math.round(frame.y)}%
                    </div>

                    <button
                      onClick={() =>
                        onSelectFrame(
                          selectedFrameId === frame.id ? null : frame.id
                        )
                      }
                      className={`w-full mt-2 px-2 py-1 text-xs rounded transition-colors ${
                        selectedFrameId === frame.id
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {selectedFrameId === frame.id ? "Selected" : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Add a random frame
                  const randomTemplate =
                    FRAME_TEMPLATES[
                      Math.floor(Math.random() * FRAME_TEMPLATES.length)
                    ];
                  handleAddFrame(randomTemplate);
                }}
                className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
              >
                Add Random Frame
              </button>
              <button
                onClick={() => {
                  // Clear all frames
                  frames.forEach((frame) => handleDeleteFrame(frame.id));
                }}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
