"use client";

import { useEffect, useState } from "react";
import Lobby from "../lobby/Lobby";
import HomeProfile from "../lobby/homeProfile/HomeProfile";
import { Socket } from "socket.io-client";
import ChatService from "@/services/Chat.service";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";
import LoadingSuspense from "../loading/LoadingSuspense";
import styles from "@/styles/lobby/Lobby.module.css";
import { toast } from "react-toastify";

export default function HomeClient({
  token,
  profile,
  avatar,
}: {
  token: string;
  profile: Profile;
  avatar: Avatar;
}) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const router = useRouter();

  // handle socket connection
  useEffect(() => {
    const handleError = () => {
      setSocket(undefined);
    };

    const disconnectClient = async () => {
      await disconnect();
      router.refresh();
    };

    if (!socket) {
      const intervalId = setInterval(async () => {
        try {
          const res = await fetch(`http://${process.env.HOST_IP}:3000/api/getToken`);
          if (!res.ok)
            throw new Error('fetch failed');

          const data = await res.json();

          if (!data.success)
            throw new Error('no cookie');

          const cookie = data.cookie;

          const chatService = new ChatService(cookie);
          if (chatService.disconnectClient) {
            clearInterval(intervalId);
            disconnectClient();
          } else if (chatService.socket) {
            setSocket(chatService.socket);
            clearInterval(intervalId);
          }
        }
        catch (err: any) {
          if (process.env && process.env.ENVIRONNEMENT && process.env.ENVIRONNEMENT === "dev")
            console.log(err.message);
        }
      }, 500);
    }

    socket?.on("disconnect", handleError);

    return () => {
      socket?.off("disconnect", handleError);
    };
  }, [socket]);

  if (!socket) return <LoadingSuspense />;

  return (
    <div className={styles.lobbyFrame}>
      <HomeProfile profile={profile} avatar={avatar} socket={socket} />
      <Lobby profile={profile} socket={socket} avatar={avatar} />
    </div>
  );
}
