"use client";

interface WallAnalysis {
  features: string[];
  suggestions: string[];
  optimalFrameCount: number;
}

interface AestheticTipsProps {
  tips: string[];
  wallAnalysis?: WallAnalysis;
}

export function AestheticTips({ tips, wallAnalysis }: AestheticTipsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Design Tips & Recommendations
      </h2>

      <div className="space-y-6">
        {/* Aesthetic Tips */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Layout Tips
          </h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Wall Analysis */}
        {wallAnalysis && (
          <>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                Wall Analysis
              </h3>
              {wallAnalysis.features.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Detected Features:
                  </p>
                  <ul className="space-y-1">
                    {wallAnalysis.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-blue-600">▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {wallAnalysis.suggestions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Suggestions:
                  </p>
                  <ul className="space-y-1">
                    {wallAnalysis.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-blue-600">▸</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Optimal Frame Count
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {wallAnalysis.optimalFrameCount} frames
                    </p>
                    <p className="text-sm text-gray-600">
                      Recommended for best visual balance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* General Guidelines */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            General Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="font-medium text-yellow-800 mb-1">📏 Spacing</p>
              <p className="text-gray-700">3-6 inches between frames</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="font-medium text-green-800 mb-1">👁️ Eye Level</p>
              <p className="text-gray-700">57-60 inches from floor</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-medium text-blue-800 mb-1">⚖️ Balance</p>
              <p className="text-gray-700">Mix frame sizes and orientations</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="font-medium text-purple-800 mb-1">💡 Lighting</p>
              <p className="text-gray-700">
                Consider natural and artificial light
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
