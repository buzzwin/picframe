"use client";

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

interface LayoutSelectorProps {
  layouts: Layout[];
  selectedLayout: Layout;
  onSelectLayout: (layout: Layout) => void;
}

export function LayoutSelector({
  layouts,
  selectedLayout,
  onSelectLayout,
}: LayoutSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Layout Options
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layouts.map((layout, index) => {
          const isSelected = selectedLayout.name === layout.name;
          return (
            <button
              key={index}
              onClick={() => onSelectLayout(layout)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? "border-purple-600 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{layout.name}</h3>
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{layout.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {layout.frames.length} frames
                </span>
                <div className="flex gap-1">
                  {getFrameSizeDistribution(layout.frames).map((count, idx) => {
                    const sizes = ["small", "medium", "large"];
                    const colors = [
                      "bg-blue-500",
                      "bg-purple-500",
                      "bg-pink-500",
                    ];
                    return count > 0 ? (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded-full text-white ${colors[idx]}`}
                      >
                        {count} {sizes[idx].charAt(0).toUpperCase()}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getFrameSizeDistribution(frames: Frame[]): [number, number, number] {
  const distribution: [number, number, number] = [0, 0, 0];
  frames.forEach((frame) => {
    if (frame.size === "small") distribution[0]++;
    else if (frame.size === "medium") distribution[1]++;
    else if (frame.size === "large") distribution[2]++;
  });
  return distribution;
}
