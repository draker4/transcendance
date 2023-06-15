import ChatBubbles from "@/components/chat/ChatBubbles";
import ChatMain from "@/components/chat/ChatMain";
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

  const  chatOpen = false;

  return (
    <html lang="en">
      <body>
        <NavbarLogged chatOpen={chatOpen}/>
        <div className={styles.layout}>
          <div className={styles.chatBubbles}>
            <ChatBubbles />
          </div>
          <div className={styles.rightScreen}>
            <div className={chatOpen ? styles.chatOpened : styles.chatClosed}>
              <ChatMain />
            </div>
            <div className={styles.children}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
