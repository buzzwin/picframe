import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { imageData, wallWidth, wallHeight, frameCount, framePreferences } = await request.json();

    console.log("API Request received:", {
      hasImageData: !!imageData,
      wallWidth,
      wallHeight,
      frameCount,
      hasApiKey: !!process.env.GEMINI_API_KEY
    });

    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key not configured");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Prepare the prompt for Gemini
    const prompt = `You are an expert interior designer and art curator specializing in picture frame arrangements and wall art placement. 

Analyze this wall image carefully and provide intelligent frame layout recommendations. Pay special attention to:

**WALL BOUNDARIES & CONSTRAINTS:**
- Identify where the wall actually starts and ends (corners, edges, architectural features)
- Note any furniture placement that would interfere with frame positioning (sofas, desks, beds, etc.)
- Detect ceiling height and any architectural elements (moldings, beams, outlets, switches)
- Identify areas that are too high (above 8 feet) or too low (below 3 feet) for comfortable viewing
- **CRITICAL: Avoid placing frames over doorways, windows, electrical outlets, light switches, or any permanent fixtures**
- **CRITICAL: Maintain safe clearance distances (at least 6 inches) from all obstacles and architectural features**
- **CRITICAL: Do not place frames where they would block or interfere with room functionality**

**AESTHETIC & VISUAL ANALYSIS:**
- Analyze the wall color, texture, and lighting conditions
- Identify existing artwork, mirrors, or decorative elements that should be considered
- Note the room's style and mood (modern, traditional, minimalist, etc.)
- Consider the wall's relationship to windows, doors, and natural light sources
- Evaluate the wall's proportions and visual weight distribution

**FRAME PLACEMENT INTELLIGENCE:**
- Recommend optimal eye-level positioning (57-60 inches from floor to center of frames)
- Suggest layouts that complement the room's furniture arrangement
- Consider visual flow and how frames guide the eye through the space
- Recommend frame sizes that are proportional to the wall and room size
- Suggest orientations and arrangements that enhance the room's aesthetic

Wall Dimensions: ${wallWidth} inches wide x ${wallHeight} inches tall
${frameCount ? `Desired number of frames: ${frameCount}` : 'Suggest optimal number of frames based on wall size and room context'}
${framePreferences ? `Frame preferences: ${framePreferences}` : ''}

Please provide a JSON response with the following structure:
{
  "layouts": [
    {
      "name": "Layout name (e.g., 'Classic Grid', 'Gallery Wall', 'Asymmetric Modern')",
      "description": "Brief description of the layout style and why it works for this wall",
      "frames": [
        {
          "id": "unique frame id",
          "x": x-position as percentage (0-100),
          "y": y-position as percentage (0-100),
          "width": width in inches,
          "height": height in inches,
          "orientation": "landscape" or "portrait",
          "size": "small", "medium", or "large",
          "placementReason": "Brief explanation of why this position works aesthetically and avoids obstacles"
        }
      ],
      "aestheticTips": ["specific tip 1", "specific tip 2", "specific tip 3"]
    }
  ],
  "wallAnalysis": {
    "features": ["wall color/type", "architectural elements", "lighting conditions", "existing decor"],
    "constraints": ["furniture interference", "height limitations", "electrical outlets", "doorways", "windows", "light switches", "architectural features", "other obstacles"],
    "suggestions": ["specific placement advice", "color recommendations", "lighting considerations"],
    "optimalFrameCount": number,
    "eyeLevelRecommendation": "specific height recommendation in inches from floor",
    "styleRecommendation": "suggested aesthetic style based on room analysis"
  }
}

Provide 3 different layout ideas that each work well for different purposes:
1. A structured, balanced layout for formal/traditional spaces
2. A dynamic gallery-style layout for modern/eclectic spaces  
3. An asymmetric artistic layout for contemporary/creative spaces

Ensure frames don't overlap and maintain appropriate spacing (3-6 inches between frames).
Consider the rule of thirds, visual balance, and the room's overall design harmony.
Be specific about why each placement works based on the actual wall image analysis.

**CRITICAL CONSTRAINTS TO FOLLOW:**
- NEVER place frames over doorways, windows, electrical outlets, or light switches
- Maintain at least 6 inches clearance from all obstacles and architectural features
- Avoid areas where frames would block room functionality or traffic flow
- Consider ceiling height limitations and furniture placement
- Ensure frames are positioned within safe viewing height (3-8 feet from floor)

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
  
  // Smart grid layout that avoids common obstacles
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const frameWidth = 16; // inches
  const frameHeight = 20; // inches
  const spacing = 6; // inches - increased for better clearance
  
  // Assume common obstacle areas (these would be detected by AI in real usage)
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
  
  // Check if a position conflicts with obstacle zones
  const isPositionSafe = (x: number, y: number, width: number, height: number) => {
    const frameLeft = x;
    const frameRight = x + (width / wallWidth) * 100;
    const frameTop = y;
    const frameBottom = y + (height / wallHeight) * 100;
    
    for (const obstacle of obstacleZones) {
      const obstacleRight = obstacle.x + obstacle.width;
      const obstacleBottom = obstacle.y + obstacle.height;
      
      // Check for overlap with safety margin
      if (frameLeft < obstacleRight + 2 && frameRight > obstacle.x - 2 &&
          frameTop < obstacleBottom + 2 && frameBottom > obstacle.y - 2) {
        return false;
      }
    }
    
    // Ensure frames are within safe viewing height (15-85% of wall height)
    if (frameTop < 15 || frameBottom > 85) {
      return false;
    }
    
    return true;
  };
  
  // Generate frames with obstacle avoidance
  let attempts = 0;
  const maxAttempts = 100;
  
  for (let i = 0; i < count && attempts < maxAttempts; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    // Calculate preferred position
    const preferredX = ((wallWidth - (cols * frameWidth + (cols - 1) * spacing)) / 2 + col * (frameWidth + spacing)) / wallWidth * 100;
    const preferredY = ((wallHeight - (rows * frameHeight + (rows - 1) * spacing)) / 2 + row * (frameHeight + spacing)) / wallHeight * 100;
    
    let x = preferredX;
    let y = preferredY;
    
    // If preferred position conflicts with obstacles, try alternative positions
    if (!isPositionSafe(x, y, frameWidth, frameHeight)) {
      // Try moving horizontally first
      const horizontalOffsets = [-10, 10, -20, 20, -30, 30];
      const verticalOffsets = [-5, 5, -10, 10, -15, 15];
      
      let foundSafePosition = false;
      
      for (const hOffset of horizontalOffsets) {
        for (const vOffset of verticalOffsets) {
          const testX = Math.max(10, Math.min(80, preferredX + hOffset));
          const testY = Math.max(20, Math.min(70, preferredY + vOffset));
          
          if (isPositionSafe(testX, testY, frameWidth, frameHeight)) {
            x = testX;
            y = testY;
            foundSafePosition = true;
            break;
          }
        }
        if (foundSafePosition) break;
      }
    }
    
    frames.push({
      id: `frame-${i}`,
      x: x,
      y: y,
      width: frameWidth,
      height: frameHeight,
      orientation: "portrait",
      size: "medium"
    });
    
    attempts++;
  }

  return {
    layouts: [
      {
        name: "Classic Grid",
        description: "A balanced grid arrangement with evenly spaced frames",
        frames: frames.map(frame => ({
          ...frame,
          placementReason: "Grid placement avoiding obstacles and maintaining safe clearances"
        })),
        aestheticTips: [
          "Maintain consistent spacing between all frames",
          "Avoid placing frames over outlets, switches, or doorways",
          "Keep frames at eye level (57-60 inches from floor to center)",
          "Maintain 6-inch clearance from architectural features"
        ]
      }
    ],
    wallAnalysis: {
      features: ["Standard wall suitable for frame arrangement", "Avoiding common obstacle zones"],
      constraints: ["Avoiding top 10% (moldings/outlets)", "Avoiding bottom 15% (furniture/baseboards)", "Avoiding edge areas (doorways/corners)", "Maintaining safe viewing height"],
      suggestions: ["Consider the lighting when positioning frames", "Leave appropriate borders around the arrangement", "Avoid placing frames over outlets or switches", "Maintain clearance from architectural features"],
      optimalFrameCount: count,
      eyeLevelRecommendation: "57-60 inches from floor to center of frames",
      styleRecommendation: "Classic grid layout suitable for traditional and modern spaces"
    }
  };
}

