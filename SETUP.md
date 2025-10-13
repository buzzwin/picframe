# PicFrame Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ===================================
# REQUIRED: Gemini API Configuration
# ===================================
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# ===================================
# OPTIONAL: Clerk Authentication
# ===================================
# Only needed if you want to use the authentication features
# Get your keys from: https://dashboard.clerk.com

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URL Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the API key
5. Paste it in your `.env.local` file as `GEMINI_API_KEY`

**Note:** The Gemini API has a generous free tier, so you can start developing without any cost.

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the App

Open your browser and navigate to:

- **PicFrame App**: [http://localhost:3000/picframe](http://localhost:3000/picframe)
- **Home Page**: [http://localhost:3000](http://localhost:3000)
- **Dashboard** (requires Clerk): [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Testing the App Without Images

If you want to test the app without uploading images, the API route includes a fallback function that generates a basic grid layout when the Gemini API is unavailable or returns an error.

## Troubleshooting

### "Gemini API key not configured" Error

**Problem:** You see an error message saying the API key is not configured.

**Solution:**

1. Make sure your `.env.local` file exists in the root directory
2. Verify the file contains `GEMINI_API_KEY=your_actual_key`
3. Restart the development server (`npm run dev`)
4. Clear your browser cache

### API Rate Limits

The free tier of Gemini API has rate limits:

- 60 requests per minute
- 1,500 requests per day

If you hit these limits, wait a minute and try again, or upgrade to a paid plan.

### Image Upload Issues

**Problem:** Images won't upload or preview.

**Solution:**

1. Check browser console for errors
2. Ensure image is in a supported format (JPEG, PNG, WebP)
3. Try with a smaller image (< 5MB recommended)
4. Check browser permissions for file access

### Canvas Not Rendering

**Problem:** The frame visualization canvas is blank or not showing frames.

**Solution:**

1. Check browser console for errors
2. Try a different browser (Chrome or Firefox recommended)
3. Ensure JavaScript is enabled
4. Clear browser cache and reload

## Production Deployment

### Environment Variables for Production

When deploying to production (Vercel, Netlify, etc.), set these environment variables in your hosting platform:

```
GEMINI_API_KEY=your_production_gemini_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx (if using Clerk)
CLERK_SECRET_KEY=sk_live_xxxxx (if using Clerk)
```

### Build the App

```bash
npm run build
npm start
```

## Optional: Clerk Authentication Setup

If you want to add user authentication to track layouts or save preferences:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy the API keys
4. Add them to your `.env.local` file
5. The authentication will automatically work with the existing pages

## Project Structure

```
/Users/gunjanvijayvergia/apps/picframe/
├── app/
│   ├── api/
│   │   └── analyze-wall/
│   │       └── route.ts          # Gemini API integration
│   ├── picframe/
│   │   ├── page.tsx              # Main PicFrame app page
│   │   └── components/
│   │       ├── WallDimensionInput.tsx
│   │       ├── FrameVisualization.tsx
│   │       ├── LayoutSelector.tsx
│   │       └── AestheticTips.tsx
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard (requires auth)
│   └── page.tsx                  # Landing page
├── .env.local                     # Your environment variables (create this)
├── SETUP.md                       # This file
├── PICFRAME_README.md            # Detailed app documentation
└── package.json
```

## Support

For detailed usage instructions, see [PICFRAME_README.md](./PICFRAME_README.md)

---

**Ready to start?** Make sure you have your Gemini API key, then run `npm run dev`! 🚀
