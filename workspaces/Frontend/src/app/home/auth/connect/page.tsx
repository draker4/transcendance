"use client"

import { Refresher } from "@/components/refresher/Refresher";
import LoadingComponent from "@/components/loading/Loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import disconnect from "@/lib/disconnect/disconnect";

export default function ConnectPage() {

  const  router = useRouter();

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
    
        await disconnect();
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
