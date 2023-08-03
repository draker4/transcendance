"use client"

import { Refresher } from "@/components/refresher/Refresher";
import Link from "next/link";
import styles from "@/styles/chatPage/ChatPage.module.css";
import LoadingComponent from "@/components/loading/Loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {

  const  router = useRouter();

  console.log("here connect page");

  useEffect(() => {
    const setCookies = async () => {
      try {
        const res = await fetch(
          `http://${process.env.HOST_IP}:3000/api/auth/google`, {
          credentials: 'include',
        });
    
        if (!res.ok)
          throw new Error("cant get new tokens");
    
        const data = await res.json();
    
        if (data.status !== 200)
          throw new Error("no token found in the api");
        
        router.replace('/home');
  
      } catch (error) {
        console.log(error);
    
        await fetch(
          `http://${process.env.HOST_IP}:3000/api/signoff`
        );
        router.replace("/welcome/login/wrong");
      }
    }

    setCookies();
  }, [])
  
  return (
    <>
      <Refresher />
      <LoadingComponent />
    </>
  );
}
