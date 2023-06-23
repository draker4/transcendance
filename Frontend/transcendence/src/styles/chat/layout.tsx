import React from "react";
import Theme from "@/components/theme/Theme";
import "@/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transcendence",
  description:
    "Transcendence is a multiplayer game where you can play with your friends and chat with them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Theme />
      </body>
    </html>
  );
}
