import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - PicFrame AI Picture Frame Layout Designer",
  description:
    "Manage your picture frame layouts and designs. View your saved layouts, track your design projects, and access your PicFrame AI design history.",
  keywords: [
    "dashboard",
    "picture frames",
    "wall art",
    "interior design",
    "AI layout",
    "home decor",
    "gallery wall",
    "frame arrangement",
  ],
  openGraph: {
    title: "Dashboard - PicFrame AI Picture Frame Layout Designer",
    description:
      "Manage your picture frame layouts and designs. View your saved layouts and track your design projects.",
    url: "https://picframe.app/dashboard",
    siteName: "PicFrame",
    images: ["/og.png"],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: false, // Dashboard should not be indexed
    follow: true,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
