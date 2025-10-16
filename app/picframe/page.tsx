"use client";

import { useState, useRef } from "react";
import { WallDimensionInput } from "./components/WallDimensionInput";
import { FrameVisualization } from "./components/FrameVisualization";
import { LayoutSelector } from "./components/LayoutSelector";
import { AestheticTips } from "./components/AestheticTips";
import { MobileNavigation } from "../components/MobileNavigation";
import { FloatingActionButton } from "../components/FloatingActionButton";
import Link from "next/link";

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

interface AnalysisResult {
  layouts: Layout[];
  wallAnalysis: {
    features: string[];
    constraints: string[];
    suggestions: string[];
    optimalFrameCount: number;
    eyeLevelRecommendation?: string;
    styleRecommendation?: string;
  };
}

export default function PicFramePage() {
  const [wallImage, setWallImage] = useState<string | null>(null);
  const [wallWidth, setWallWidth] = useState<number>(120); // inches
  const [wallHeight, setWallHeight] = useState<number>(96); // inches
  const [frameCount, setFrameCount] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setWallImage(e.target?.result as string);
        setAnalysisResult(null);
        setSelectedLayout(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setWallImage(e.target?.result as string);
        setAnalysisResult(null);
        setSelectedLayout(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWall = async () => {
    if (!wallImage) {
      setError("Please upload or capture a wall image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-wall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: wallImage,
          wallWidth,
          wallHeight,
          frameCount,
          framePreferences: "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze wall");
      }

      const data = await response.json();
      setAnalysisResult(data);
      if (data.layouts && data.layouts.length > 0) {
        setSelectedLayout(data.layouts[0]);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        "Failed to analyze wall. Please check your API key and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRandomizeLayout = () => {
    if (analysisResult && analysisResult.layouts.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * analysisResult.layouts.length
      );
      setSelectedLayout(analysisResult.layouts[randomIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Desktop Header */}
      <header className="hidden md:block bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PicFrame
              </h1>
              <span className="text-sm text-gray-500">
                AI Picture Frame Layout Designer
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 md:py-8">
        {/* Mobile Full-Screen Layout */}
        {selectedLayout && wallImage ? (
          <div className="md:hidden">
            {/* Back Button */}
            <div className="mb-3">
              <button
                onClick={() => {
                  setSelectedLayout(null);
                  setAnalysisResult(null);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Upload
              </button>
            </div>

            {/* Mobile Visualization - Full Screen */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Frame Layout
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleRandomizeLayout}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs"
                  >
                    <svg
                      className="w-3 h-3 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Shuffle
                  </button>
                </div>
              </div>
              <FrameVisualization
                wallImage={wallImage}
                layout={selectedLayout}
                wallWidth={wallWidth}
                wallHeight={wallHeight}
              />
            </div>

            {/* Mobile Controls */}
            <div className="space-y-3">
              {/* Layout Selector */}
              {analysisResult && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Layout Options
                  </h3>
                  <div className="space-y-2">
                    {analysisResult.layouts.map((layout, index) => {
                      const isSelected = selectedLayout.name === layout.name;
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedLayout(layout)}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {layout.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {layout.description}
                              </p>
                            </div>
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
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tips */}
              <AestheticTips
                tips={selectedLayout.aestheticTips}
                wallAnalysis={analysisResult?.wallAnalysis}
              />
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-8">
          {/* Left Panel - Upload and Settings */}
          <div
            className={`lg:col-span-1 space-y-3 md:space-y-6 ${
              selectedLayout && wallImage ? "hidden md:block" : ""
            }`}
          >
            {/* Image Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                1. Upload Wall Image
              </h2>

              <div className="space-y-4">
                {!wallImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Upload or capture your wall image
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={wallImage}
                      alt="Wall"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setWallImage(null);
                        setAnalysisResult(null);
                        setSelectedLayout(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload
                  </button>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Camera
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                />
              </div>
            </div>

            {/* Wall Dimensions */}
            <WallDimensionInput
              wallWidth={wallWidth}
              wallHeight={wallHeight}
              onWidthChange={setWallWidth}
              onHeightChange={setWallHeight}
            />

            {/* Frame Count */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                3. Number of Frames
              </h2>
              <div className="space-y-3">
                <input
                  type="number"
                  value={frameCount || ""}
                  onChange={(e) =>
                    setFrameCount(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  placeholder="Auto-suggest"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  max="50"
                />
                <p className="text-sm text-gray-500">
                  Leave empty for AI to suggest optimal count
                </p>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeWall}
              disabled={!wallImage || isAnalyzing}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Generate Layout Ideas"
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Right Panel - Visualization and Results */}
          <div className="lg:col-span-2 space-y-2 md:space-y-6 hidden md:block">
            {selectedLayout && wallImage ? (
              <>
                {/* Visualization */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Frame Layout Preview
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleRandomizeLayout}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        <svg
                          className="w-4 h-4 inline mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Randomize
                      </button>
                    </div>
                  </div>
                  <FrameVisualization
                    wallImage={wallImage}
                    layout={selectedLayout}
                    wallWidth={wallWidth}
                    wallHeight={wallHeight}
                  />
                </div>

                {/* Layout Selector */}
                {analysisResult && (
                  <LayoutSelector
                    layouts={analysisResult.layouts}
                    selectedLayout={selectedLayout}
                    onSelectLayout={setSelectedLayout}
                  />
                )}

                {/* Aesthetic Tips */}
                <AestheticTips
                  tips={selectedLayout.aestheticTips}
                  wallAnalysis={analysisResult?.wallAnalysis}
                />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Layout Yet
                  </h3>
                  <p className="text-gray-600">
                    Upload a wall image, set dimensions, and click "Generate
                    Layout Ideas" to get started!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton
        onClick={() => {
          // Reset the form to start a new layout
          setWallImage(null);
          setWallWidth(120);
          setWallHeight(96);
          setFrameCount(null);
          setAnalysisResult(null);
          setSelectedLayout(null);
          setError(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        }
        label="New Layout"
      />
    </div>
  );
}
