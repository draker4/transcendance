import React from "react";
import "@/styles/globals.css";
import NavbarServ from "@/components/navbar/NavbarServ";
import Footer from "@/components/footer/Footer";
import ScrollBtn from "@/components/scrollBtn/ScrollBtn";

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
      <body>
        <NavbarServ />
        {children}
        <Footer />
        <ScrollBtn />
      </body>
    </html>
  );
}
