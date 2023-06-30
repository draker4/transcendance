import { ChatSocketContext } from "@/context/ChatSocketContext";
import { useContext, useEffect } from "react";

export default function ChatPrivateMsg() {
  const socket = useContext(ChatSocketContext);

  // [!] a chopper par les props ensuite
  const friendId:number = 2;

  // creation ou recuperation si existe deja de la channel type private message
  useEffect(() => {
    



  }, [socket])

  return <div>ChatPrivateMsg</div>;
}
