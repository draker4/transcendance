import LoadingSuspense from "@/components/loading/LoadingSuspense";
import { Refresher } from "@/components/refresher/Refresher";
import { Suspense } from "react";
import styles from "@/styles/chatPage/ChatPage.module.css";
import Link from "next/link";
import SignupLocalhost from "@/components/welcome/signup/SignupLocalhost";
import SignupIp from "@/components/welcome/signup/SignupIp";

export default async function SignUpPage() {

  if (!process.env.ENVIRONNEMENT || (process.env.ENVIRONNEMENT !== "dev" && process.env.ENVIRONNEMENT !== "build"))
    return (
      <div className={styles.error}>
				<h2>Oops... Something went wrong!</h2>
				<Link href={"/welcome"} className={styles.errorLink}>
					<p>Return to Home Page!</p>
				</Link>
			</div>
    )

  else if (process.env.ENVIRONNEMENT === "dev")
    return (
      <>
        <Refresher />
        <Suspense fallback={<LoadingSuspense/>}>
          <SignupLocalhost />
        </Suspense>
      </>
    )

  else
    return (
      <>
        <Refresher />
        <Suspense fallback={<LoadingSuspense/>}>
          <SignupIp />
        </Suspense>
      </>
    )
}
