import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { imageData, wallWidth, wallHeight, frameCount, framePreferences } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt for Gemini
    const prompt = `You are an interior design expert specializing in picture frame arrangements. 

Analyze this wall image and provide frame layout recommendations with the following details:

Wall Dimensions: ${wallWidth} inches wide x ${wallHeight} inches tall
${frameCount ? `Desired number of frames: ${frameCount}` : 'Suggest optimal number of frames'}
${framePreferences ? `Frame preferences: ${framePreferences}` : ''}

Please provide a JSON response with the following structure:
{
  "layouts": [
    {
      "name": "Layout name (e.g., 'Classic Grid', 'Gallery Wall', 'Asymmetric Modern')",
      "description": "Brief description of the layout style",
      "frames": [
        {
          "id": "unique frame id",
          "x": x-position as percentage (0-100),
          "y": y-position as percentage (0-100),
          "width": width in inches,
          "height": height in inches,
          "orientation": "landscape" or "portrait",
          "size": "small", "medium", or "large"
        }
      ],
      "aestheticTips": ["tip 1", "tip 2", "tip 3"]
    }
  ],
  "wallAnalysis": {
    "features": ["feature 1", "feature 2"],
    "suggestions": ["suggestion 1", "suggestion 2"],
    "optimalFrameCount": number
  }
}

Provide 3 different layout ideas: a structured grid layout, a gallery-style layout, and an asymmetric modern layout.
Ensure frames don't overlap and maintain appropriate spacing (3-6 inches between frames).
Consider the rule of thirds and visual balance.
Return ONLY valid JSON, no additional text.`;

    // Convert base64 image data to the format Gemini expects
    const imageData64 = imageData.split(',')[1] || imageData;
    
    const imagePart = {
      inlineData: {
        data: imageData64,
        mimeType: "image/jpeg",
      },
    };

    // Generate content with both image and text
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let layoutData;
    try {
      // Clean up the response text (remove markdown code blocks if present)
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      layoutData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", text);
      
      // Return a fallback response if parsing fails
      layoutData = generateFallbackLayout(wallWidth, wallHeight, frameCount);
    }

    return NextResponse.json(layoutData);
  } catch (error) {
    console.error("Error analyzing wall:", error);
    return NextResponse.json(
      { error: "Failed to analyze wall. Please try again." },
      { status: 500 }
    );
  }
}

// Fallback layout generator if Gemini API fails
function generateFallbackLayout(wallWidth: number, wallHeight: number, frameCount?: number) {
  const count = frameCount || 6;
  const frames = [];
  
  // Simple grid layout
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const frameWidth = 16; // inches
  const frameHeight = 20; // inches
  const spacing = 4; // inches
  
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    frames.push({
      id: `frame-${i}`,
      x: ((wallWidth - (cols * frameWidth + (cols - 1) * spacing)) / 2 + col * (frameWidth + spacing)) / wallWidth * 100,
      y: ((wallHeight - (rows * frameHeight + (rows - 1) * spacing)) / 2 + row * (frameHeight + spacing)) / wallHeight * 100,
      width: frameWidth,
      height: frameHeight,
      orientation: "portrait",
      size: "medium"
    });
  }

  return {
    layouts: [
      {
        name: "Classic Grid",
        description: "A balanced grid arrangement with evenly spaced frames",
        frames: frames,
        aestheticTips: [
          "Maintain consistent spacing between all frames",
          "Center the arrangement on the wall",
          "Keep frames at eye level (57-60 inches from floor to center)"
        ]
      }
    ],
    wallAnalysis: {
      features: ["Standard wall suitable for frame arrangement"],
      suggestions: ["Consider the lighting when positioning frames", "Leave appropriate borders around the arrangement"],
      optimalFrameCount: count
    }
  };
}

