# PicFrame - AI-Powered Picture Frame Layout Designer

PicFrame is an intelligent web application that helps you design the perfect picture frame layout for your walls using AI. Simply upload a photo of your wall, specify dimensions, and let the Gemini AI suggest beautiful, balanced frame arrangements.

## 🌟 Features

### Core Functionality

- **📸 Image Upload & Camera Capture**: Upload a wall photo or take one directly with your device camera
- **📏 Wall Dimension Input**: Specify exact wall dimensions in inches for accurate layouts
- **🤖 AI-Powered Analysis**: Uses Google's Gemini AI to analyze your wall and suggest optimal layouts
- **🎨 Multiple Layout Styles**: Get 3 different layout suggestions:
  - Classic Grid: Structured and symmetrical
  - Gallery Wall: Creative and artistic
  - Asymmetric Modern: Contemporary and dynamic

### Visualization

- **🖼️ Interactive Canvas Preview**: See frame layouts overlaid on your actual wall image
- **🎯 Frame Details**: Each frame shows dimensions, size category, and position
- **🔄 Randomize Layouts**: Quickly switch between different layout ideas
- **📦 Size Categories**: Frames are categorized as Small, Medium, or Large with color coding

### Export & Sharing

- **💾 Export as Image**: Download your layout design as a PNG image
- **🖨️ Print Layout**: Print-friendly layout with wall and frame details
- **📋 Design Tips**: Get professional aesthetic tips for your specific layout

### Smart Features

- **✨ Optimal Frame Count**: AI suggests the best number of frames for your wall
- **🎯 Spacing Guidelines**: Automatic calculation of proper frame spacing (3-6 inches)
- **👁️ Eye Level Recommendations**: Ensures frames are positioned at proper viewing height (57-60 inches)
- **⚖️ Visual Balance**: AI considers rule of thirds and visual harmony

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key (get one at https://makersuite.google.com/app/apikey)
- (Optional) Clerk account for authentication features

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Required: Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional: Clerk Authentication (if using auth features)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

4. **Open PicFrame**
   Navigate to [http://localhost:3000/picframe](http://localhost:3000/picframe)

## 📖 How to Use

### Step 1: Upload Your Wall Image

- Click "Upload" to select an image from your device
- Or click "Camera" to take a photo directly (mobile-friendly)
- The image should show a clear view of the wall you want to decorate

### Step 2: Set Wall Dimensions

- Enter the width and height of your wall in inches
- Default: 120" wide × 96" tall (10' × 8')
- Tip: Standard walls are typically 96" (8 feet) tall

### Step 3: Specify Frame Count (Optional)

- Enter the desired number of frames
- Leave empty to let AI suggest the optimal count
- Range: 1-50 frames

### Step 4: Generate Layouts

- Click "Generate Layout Ideas"
- Wait for AI analysis (usually 5-10 seconds)
- View three different layout suggestions

### Step 5: Explore & Customize

- Click on different layout options to preview them
- Use the "Randomize" button to cycle through layouts
- Read the aesthetic tips and recommendations

### Step 6: Export or Print

- Click "Export Image" to download as PNG
- Click "Print" for a print-friendly version with details

## 🎨 Layout Types Explained

### Classic Grid

- Structured, symmetrical arrangement
- Equal spacing between all frames
- Best for: Traditional spaces, formal rooms
- Creates a clean, organized look

### Gallery Wall

- Creative, salon-style arrangement
- Mix of frame sizes and orientations
- Best for: Living rooms, hallways, creative spaces
- Adds personality and visual interest

### Asymmetric Modern

- Contemporary, dynamic placement
- Intentional imbalance for visual impact
- Best for: Modern homes, statement walls
- Creates a bold, artistic impression

## 🧠 AI Analysis Features

The Gemini AI analyzes your wall and provides:

1. **Wall Features Detection**: Identifies architectural elements, lighting, colors
2. **Layout Recommendations**: Suggests frame arrangements based on wall characteristics
3. **Optimal Frame Count**: Calculates ideal number of frames for visual balance
4. **Spacing Calculations**: Ensures proper distance between frames
5. **Aesthetic Tips**: Professional design advice specific to your layout

## 📐 Design Guidelines

### Frame Spacing

- **Between frames**: 3-6 inches
- **From ceiling**: 12-18 inches
- **From floor**: Account for furniture height
- **From corners**: Minimum 6 inches

### Hanging Height

- **Standard**: 57-60 inches from floor to frame center
- **Above furniture**: 6-8 inches above furniture top
- **Gallery walls**: Center the entire group at eye level

### Frame Sizing

- **Small**: 8×10" to 11×14"
- **Medium**: 16×20" to 20×24"
- **Large**: 24×36" and larger

## 🔧 Technical Details

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 1.5 Flash
- **Authentication**: Clerk (optional)

### API Endpoints

#### POST /api/analyze-wall

Analyzes wall image and generates frame layouts

**Request Body:**

```json
{
  "imageData": "base64_encoded_image",
  "wallWidth": 120,
  "wallHeight": 96,
  "frameCount": 6,
  "framePreferences": "modern, colorful"
}
```

**Response:**

```json
{
  "layouts": [
    {
      "name": "Classic Grid",
      "description": "A balanced grid arrangement",
      "frames": [
        {
          "id": "frame-1",
          "x": 10,
          "y": 20,
          "width": 16,
          "height": 20,
          "orientation": "portrait",
          "size": "medium"
        }
      ],
      "aestheticTips": ["Tip 1", "Tip 2"]
    }
  ],
  "wallAnalysis": {
    "features": ["Good natural lighting"],
    "suggestions": ["Consider wall color"],
    "optimalFrameCount": 6
  }
}
```

## 🎯 Best Practices

### Photography Tips

1. Take photos straight-on (not at an angle)
2. Ensure good lighting
3. Include the full wall area
4. Remove any existing decorations for clearer analysis

### Layout Design Tips

1. Start with odd numbers of frames (3, 5, 7) for dynamic looks
2. Mix frame sizes for visual interest
3. Maintain consistent spacing throughout
4. Consider furniture placement below the wall
5. Test layouts with paper templates before hanging

### Common Mistakes to Avoid

- Hanging frames too high
- Inconsistent spacing
- Frames too small for the wall
- Ignoring architectural features
- Poor lighting consideration

## 🐛 Troubleshooting

### "Failed to analyze wall"

- Check your Gemini API key is correct
- Ensure the image is a valid format (JPG, PNG, WebP)
- Try with a smaller image size
- Check your internet connection

### Layout looks off

- Verify wall dimensions are accurate
- Try different frame count
- Consider architectural features in your photo
- Regenerate with different preferences

### Export not working

- Check browser permissions for downloads
- Try a different browser
- Ensure you're not in private/incognito mode

## 📝 Sample Prompts for Gemini

The app uses structured prompts to get optimal results:

```
You are an interior design expert specializing in picture frame arrangements.

Analyze this wall image and provide frame layout recommendations with:
- Wall Dimensions: [width] x [height]
- Desired frames: [count]
- Preferences: [style preferences]

Provide JSON response with 3 layouts (grid, gallery, asymmetric)
ensuring proper spacing and visual balance.
```

## 🤝 Contributing

Feel free to enhance the app with:

- Additional layout algorithms
- More frame size options
- 3D visualization
- Room style detection
- Frame shopping integration

## 📄 License

This project is part of a Next.js + Clerk starter template.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent layout generation
- Clerk for authentication
- Next.js team for the excellent framework
- Tailwind CSS for beautiful styling

## 📞 Support

For issues or questions:

1. Check this README first
2. Review the troubleshooting section
3. Check the browser console for errors
4. Verify API keys and environment variables

---

**Made with ❤️ using Next.js, TypeScript, and Google Gemini AI**

Start designing beautiful wall layouts today! 🎨🖼️
