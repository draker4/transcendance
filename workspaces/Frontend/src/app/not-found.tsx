import Link from 'next/link';
import styles from "@/styles/notFound/NotFound.module.css";
 
export default function NotFound() {
  return (
    <div className={styles.main}>
      <h2>Oops... this page does not exist!</h2>
      <Link href="/" className={styles.link}>Return to <span>Home Page</span></Link>
    </div>
  )
}
