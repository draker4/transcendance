import ChatServer from "@/components/chat/ChatServer";
import styles from "@/styles/home/HomeLayout.module.css";

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
    <main className={styles.main}>
      <ChatServer />
      <div className={styles.children}>{children}</div>
    </main>
  );
}
