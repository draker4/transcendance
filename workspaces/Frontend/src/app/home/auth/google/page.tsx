"use client"

import { Refresher } from "@/components/refresher/Refresher";
import Link from "next/link";
import styles from "@/styles/chatPage/ChatPage.module.css";
import LoadingComponent from "@/components/loading/Loading";
import { useEffect, useState } from "react";
// import { cookies } from "next/headers";

export default async function GooglePage() {

  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const setCookies = async () => {
      try {
        const res = await fetch(
          `http://${process.env.HOST_IP}:3000/api/auth/google`, {
          credentials: 'include',
        });
    
        if (!res.ok) throw new Error("cant get new tokens");
    
        const data = await res.json();
    
        if (data.status !== 200) throw new Error("no token found in the api");
      } catch (error) {
        console.log(error);
    
        await fetch(
          `http://${process.env.HOST_IP}:3000/api/signoff`
        );
        setError(true);
      }
    }

    setCookies();
  }, [])
  

  if (!error)
    return (
      <>
        <Refresher />
        <LoadingComponent />
      </>
    );
  
  else
    return (
      <div className={styles.error}>
        <h2>Oops... Something went wrong!</h2>
        <Link href={"/welcome/login/wrong"} className={styles.errorLink}>
          <p>Return to Login Page!</p>
        </Link>
      </div>
    );
}
