"use client";

interface WallDimensionInputProps {
  wallWidth: number;
  wallHeight: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

export function WallDimensionInput({
  wallWidth,
  wallHeight,
  onWidthChange,
  onHeightChange,
}: WallDimensionInputProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        2. Wall Dimensions
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Width (inches)
          </label>
          <input
            type="number"
            value={wallWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            min="12"
            max="600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (inches)
          </label>
          <input
            type="number"
            value={wallHeight}
            onChange={(e) => onHeightChange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            min="12"
            max="600"
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Standard walls are typically 96" tall (8
            feet) and 120-144" wide (10-12 feet)
          </p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-600">Wall Area:</span>
          <span className="text-lg font-semibold text-gray-800">
            {((wallWidth * wallHeight) / 144).toFixed(1)} sq ft
          </span>
        </div>
      </div>
    </div>
  );
}
