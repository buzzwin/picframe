import { Metadata } from "next";

export const templateMetadata: Metadata = {
  metadataBase: new URL("https://picframe.app/"),
  title: "PicFrame - AI Picture Frame Layout Designer",
  description:
    "Design perfect picture frame layouts with AI. Upload your wall photo and get intelligent frame placement recommendations for any room style.",
  keywords: ["picture frames", "wall art", "interior design", "AI layout", "home decor", "gallery wall", "frame arrangement"],
  authors: [{ name: "PicFrame Team" }],
  creator: "PicFrame",
  publisher: "PicFrame",
  openGraph: { 
    title: "PicFrame - AI Picture Frame Layout Designer",
    description: "Design perfect picture frame layouts with AI. Upload your wall photo and get intelligent frame placement recommendations.",
    url: "https://picframe.app",
    siteName: "PicFrame",
    images: ["/og.png"],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "PicFrame - AI Picture Frame Layout Designer",
    description: "Design perfect picture frame layouts with AI. Upload your wall photo and get intelligent frame placement recommendations.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Default metadata for when template is removed
export const defaultMetadata: Metadata = {
  title: "PicFrame - AI Picture Frame Layout Designer",
  description: "Design perfect picture frame layouts with AI. Upload your wall photo and get intelligent frame placement recommendations.",
};
