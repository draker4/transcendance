import React from "react";
import "@/styles/globals.css";
import Footer from "@/components/footer/Footer";
import ScrollBtn from "@/components/scrollBtn/ScrollBtn";
import Navbar from "@/components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Transcendence",
  description:
    "Transcendence is a multiplayer pong where you can play with your friends and chat with them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <ToastContainer />
        {children}
        <ScrollBtn />
        <Footer />
      </body>
    </html>
  );
}
