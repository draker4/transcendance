import ChatServer from "@/components/chat/ChatServer";
import styles from "@/styles/home/HomeLayout.module.css";

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
    <main className={styles.main}>
      <ChatServer />
      <div className={styles.children}>{children}</div>
    </main>
  );
}
