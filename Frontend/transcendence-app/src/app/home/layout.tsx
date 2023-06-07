import NavbarLogged from "@/components/NavbarLogged"
import "@/styles/globals.css";

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
        {children}
      </body>
    </html>
  )
}
