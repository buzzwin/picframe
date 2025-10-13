# ✅ Get Started with PicFrame - Checklist

Follow these steps to get PicFrame running on your machine!

---

## 📋 Pre-Flight Checklist

### ✅ Step 1: Get Your Gemini API Key (2 minutes)

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the key (starts with `AIza...`)

**✅ Got your API key?** → Continue to Step 2

---

### ✅ Step 2: Set Up Environment Variables (1 minute)

**Option A - Copy Template (Recommended):**

```bash
cp env.template .env.local
```

Then open `.env.local` and replace the placeholder:

```env
GEMINI_API_KEY=paste_your_actual_api_key_here
```

**Option B - Create Manually:**
Create a new file named `.env.local` in the root directory with:

```env
GEMINI_API_KEY=your_api_key_here
```

**✅ Created .env.local with your API key?** → Continue to Step 3

---

### ✅ Step 3: Install Dependencies (1 minute)

```bash
npm install
```

Wait for packages to install...

**✅ Installation complete?** → Continue to Step 4

---

### ✅ Step 4: Start the Development Server (30 seconds)

```bash
npm run dev
```

You should see:

```
  ▲ Next.js 15.3.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in [X]ms
```

**✅ Server running?** → Continue to Step 5

---

### ✅ Step 5: Open PicFrame (10 seconds)

Open your browser and go to:

**👉 http://localhost:3000/picframe**

You should see the PicFrame interface with:

- Upload/Camera buttons
- Wall dimension inputs
- "Generate Layout Ideas" button

**✅ Page loaded successfully?** → Continue to Step 6

---

### ✅ Step 6: Test the App (2 minutes)

1. **Upload a Wall Image**
   - Click "Upload" or "Camera"
   - Select any wall photo (or use a sample image)
2. **Set Dimensions** (optional)
   - Leave default (120" × 96") or enter custom size
3. **Generate Layouts**
   - Click "Generate Layout Ideas"
   - Wait 5-10 seconds
4. **See Results!**
   - View 3 different layout suggestions
   - Click different layouts to switch
   - Try "Randomize" button
   - Export or print your layout

**✅ Layouts generated successfully?** → 🎉 **You're all set!**

---

## 🎉 Success! What's Next?

### Explore Features

- 🎨 Try different frame counts
- 📐 Test various wall sizes
- 🔄 Randomize layouts
- 💾 Export your favorite designs
- 📖 Read design tips

### Learn More

- **Full Documentation**: [PICFRAME_README.md](./PICFRAME_README.md)
- **Setup Details**: [SETUP.md](./SETUP.md)
- **Quick Reference**: [QUICKSTART.md](./QUICKSTART.md)
- **Implementation**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🐛 Troubleshooting

### ❌ "API key not configured" error

**Problem:** Environment variable not loaded

**Solutions:**

1. Verify `.env.local` exists in root directory
2. Check API key is correct (no spaces)
3. Restart development server: `Ctrl+C` then `npm run dev`
4. Clear browser cache and reload

---

### ❌ "Failed to analyze wall" error

**Problem:** API request failed

**Solutions:**

1. Check internet connection
2. Verify API key is valid
3. Check if you hit rate limits (wait 1 minute)
4. Try with a different/smaller image

---

### ❌ Page won't load

**Problem:** Server or routing issue

**Solutions:**

1. Make sure server is running (`npm run dev`)
2. Check console for error messages
3. Try clearing port: `lsof -ti:3000 | xargs kill -9`
4. Restart server

---

### ❌ Canvas is blank

**Problem:** Rendering issue

**Solutions:**

1. Try different browser (Chrome/Firefox)
2. Check browser console for errors
3. Disable browser extensions
4. Clear cache and reload

---

## 📞 Still Need Help?

1. **Check browser console** (F12 → Console tab)
2. **Review error messages** in terminal
3. **Read documentation** in linked files above
4. **Verify all steps** in this checklist

---

## 🎯 Quick Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 📁 Important Files

```
.env.local                 ← Your API key (create this!)
env.template              ← Template to copy
package.json              ← Dependencies
/app/picframe/            ← Main app
/app/api/analyze-wall/    ← API endpoint
```

---

## 🚀 Ready to Deploy?

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` in Environment Variables
4. Deploy!

### Other Platforms

- Netlify: Works great
- AWS Amplify: Supported
- Google Cloud: Supported
- Self-hosted: Use `npm run build && npm start`

---

## ✨ Tips for Best Results

### Photography Tips

- 📸 Take photos straight-on, not at an angle
- 💡 Use good lighting
- 📏 Show the full wall area
- 🎨 Remove existing decorations

### Design Tips

- Use odd numbers of frames (3, 5, 7)
- Mix frame sizes for visual interest
- Maintain 3-6 inch spacing
- Consider furniture placement

---

## 🎨 Example Workflow

1. **Take a photo** of your empty wall
2. **Measure** the wall (width × height in inches)
3. **Upload** photo to PicFrame
4. **Enter** dimensions
5. **Choose** number of frames (or let AI decide)
6. **Generate** layout ideas
7. **Explore** different options
8. **Export** your favorite layout
9. **Print** or save for reference
10. **Hang frames** following the layout!

---

## 🎉 You're Ready!

**Enjoy creating beautiful frame layouts!** 🖼️✨

---

**Quick Links:**

- 🚀 [Quick Start](./QUICKSTART.md)
- 📖 [Full Guide](./PICFRAME_README.md)
- 🔧 [Setup Details](./SETUP.md)
- 📊 [Implementation](./IMPLEMENTATION_SUMMARY.md)

---

Made with ❤️ using Next.js, TypeScript, and Google Gemini AI
