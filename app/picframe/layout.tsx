import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "PicFrame - AI Picture Frame Layout Designer | Create Perfect Wall Art Arrangements",
  description:
    "Design perfect picture frame layouts with AI. Upload your wall photo and get intelligent frame placement recommendations for any room style. Create gallery-worthy displays in minutes.",
  keywords: [
    "picture frames",
    "wall art",
    "interior design",
    "AI layout",
    "home decor",
    "gallery wall",
    "frame arrangement",
    "wall design",
    "art placement",
  ],
  openGraph: {
    title: "PicFrame - AI Picture Frame Layout Designer",
    description:
      "Design perfect picture frame layouts with AI. Upload your wall photo and get intelligent frame placement recommendations.",
    url: "https://picframe.app/picframe",
    siteName: "PicFrame",
    images: ["/og.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PicFrame - AI Picture Frame Layout Designer",
    description:
      "Design perfect picture frame layouts with AI. Upload your wall photo and get intelligent frame placement recommendations.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PicFrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
