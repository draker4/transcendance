import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/navbar/Navbar.module.css";
import ChatService from "@/services/Chat.service";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

export default function ChatBtn({ token }: { token: string | undefined }) {
  const chatService = new ChatService(token);
  const [socket, setSocket] = useState<Socket | undefined>(chatService.socket);


  useEffect(() => {

    const handleError = () => {
      setSocket(undefined);
    }

    socket?.on("disconnect", handleError);

    return () => {
      socket?.off("disconnect", handleError);
    }
  }, [socket]);

  if (!socket) {

    const intervalId = setInterval(() => {
      const chatService = new ChatService();
      if (chatService.socket) {
        setSocket(chatService.socket);
        clearInterval(intervalId);
        toast.info("Connection closed! Reconnecting...");
      }
      console.log("btnservice reload here", chatService.socket?.id);
    }, 500);
  }

  return <FontAwesomeIcon icon={faComments} className={styles.menu} />;
}
