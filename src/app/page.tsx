import React from "react";
import App from "~/components/App";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jukebox",
  themeColor: "#FF0000",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { type: "image/png", sizes: "192x192", url: "/android-icon-192x192.png" },
      { type: "image/png", sizes: "96x96", url: "/favicon-96x96.png" },
      { type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    ],
    apple: [
      { type: "image/png", sizes: "57x57", url: "/apple-icon-57x57.png" },
      { type: "image/png", sizes: "60x60", url: "/apple-icon-60x60.png" },
      { type: "image/png", sizes: "72x72", url: "/apple-icon-72x72.png" },
      { type: "image/png", sizes: "76x76", url: "/apple-icon-76x76.png" },
      { type: "image/png", sizes: "114x114", url: "/apple-icon-114x114.png" },
      { type: "image/png", sizes: "120x120", url: "/apple-icon-120x120.png" },
      { type: "image/png", sizes: "144x144", url: "/apple-icon-144x144.png" },
      { type: "image/png", sizes: "152x152", url: "/apple-icon-152x152.png" },
      { type: "image/png", sizes: "180x180", url: "/apple-icon-180x180.png" },
    ],
  },
};

const Page = () => (
  <App />
);

export default Page;
