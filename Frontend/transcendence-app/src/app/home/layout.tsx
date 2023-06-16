import ChatServer from "@/components/chat/ChatServer";
import NavbarLogged from "@/components/navbar/NavbarLogged"
import "@/styles/globals.css";
import styles from "@/styles/layout/Layout.module.css";

export const metadata = {
  title: 'Logged',
  description: 'The client is loggeda in',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
        <NavbarLogged />
        <div className={styles.main}>
          <ChatServer />
          <div className={styles.children}>
            { children }
          </div>
        </div>
      </body>
    </html>
  )
}
