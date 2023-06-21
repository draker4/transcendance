import ChatServer from "@/components/chat/ChatServer";
import NavbarLogged from "@/components/navbar/NavbarLogged";

export const metadata = {
  title: "Logged",
  description: "The client is logged in",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavbarLogged />
      <div>
        <ChatServer />
        {children}
      </div>
    </div>
  );
}
