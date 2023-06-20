import React from "react";
import Theme from "@/components/theme/Theme";
import "@/styles/globals.css"

export const metadata = {
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
      {/* <body className={inter.className} suppressHydrationWarning={true}> */}
      <body>
        {children}
        <Theme />
      </body>
    </html>
  );
}
