import React from "react";
import NavbarWelcome from "@/components/navbar/NavbarWelcome";

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
    <div>
      <NavbarWelcome />
      {children}
    </div>
  );
}
