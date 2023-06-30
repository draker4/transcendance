import React from "react";
import "@/styles/globals.css";
import NavbarServ from "@/components/navbar/NavbarServ";
import ChatServer from "@/components/chat/ChatServer";
import Footer from "@/components/footer/Footer";

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
      </body>
    </html>
  );
}
