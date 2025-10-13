# 🚀 PicFrame - Quick Start Guide

Get up and running with PicFrame in under 5 minutes!

## ⚡ Super Quick Start (3 Steps)

### 1️⃣ Get Your Free Gemini API Key

Visit: **https://makersuite.google.com/app/apikey**

- Sign in with Google
- Click "Create API Key"
- Copy the key

### 2️⃣ Create Your Environment File

```bash
cp env.template .env.local
```

Then edit `.env.local` and replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 3️⃣ Start the App

```bash
npm install
npm run dev
```

🎉 **Done!** Open http://localhost:3000/picframe

---

## 🎯 What You Can Do

### Upload a Wall Photo

- Click "Upload" to select from your device
- Or click "Camera" to take a photo (mobile-friendly)

### Set Wall Dimensions

- Enter width and height in inches
- Default: 120" × 96" (10ft × 8ft wall)

### Generate Layouts

- Optionally specify number of frames
- Click "Generate Layout Ideas"
- Get 3 AI-powered layout suggestions!

### Explore & Export

- Try different layout styles
- Click "Randomize" for new ideas
- Export as image or print

---

## 📂 Project Files

### Your App

```
/picframe              → Main PicFrame application
/api/analyze-wall      → Gemini AI integration endpoint
```

### Your Documentation

```
QUICKSTART.md          → This file (quick start)
SETUP.md              → Detailed setup instructions
PICFRAME_README.md    → Full app documentation
env.template          → Environment variables template
```

### Original Template

```
/dashboard            → Clerk auth dashboard (optional)
/sign-in              → Sign-in page (optional)
/                     → Landing page
```

---

## 🔧 Common Issues & Solutions

### "Gemini API key not configured"

**Fix:** Make sure `.env.local` exists and contains your API key, then restart the server

### Rate Limit Errors

**Info:** Free tier allows 60 requests/min, 1500/day. Wait a minute or upgrade.

### Canvas Not Showing

**Fix:** Try Chrome or Firefox browser, clear cache, check browser console

### Image Won't Upload

**Fix:** Ensure image is < 5MB, in JPG/PNG/WebP format

---

## 🎨 Tips for Best Results

### Photography

✅ Take photo straight-on (not angled)  
✅ Use good lighting  
✅ Show the full wall  
✅ Remove existing decorations

### Layout Design

✅ Use odd numbers of frames (3, 5, 7)  
✅ Mix frame sizes for interest  
✅ Maintain 3-6" spacing  
✅ Consider furniture below wall

---

## 📚 Learn More

- **Full App Guide**: [PICFRAME_README.md](./PICFRAME_README.md)
- **Setup Details**: [SETUP.md](./SETUP.md)
- **Main README**: [README.md](./README.md)

---

## 🆘 Need Help?

1. Check the browser console (F12) for errors
2. Verify your API key is correct
3. Make sure you ran `npm install`
4. Restart the dev server
5. Read the full documentation

---

## 🎉 You're Ready!

**Start designing beautiful wall layouts now:**

👉 http://localhost:3000/picframe

---

**Built with:**

- Next.js 15
- TypeScript
- Tailwind CSS
- Google Gemini AI
- ❤️

Enjoy creating stunning frame layouts! 🖼️✨
