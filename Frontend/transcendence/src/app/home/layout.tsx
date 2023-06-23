import ChatServer from "@/components/chat/ChatServer";
import NavbarLogged from "@/components/navbar/NavbarLogged";
import styles from "@/styles/page/HomeLayout.module.css";

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
    <div className={styles.all}>
      <NavbarLogged />
      <div className={styles.main}>
        <ChatServer />
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
}
