"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/profile/InfoCard.module.css";
import NavbarChannelInfo from "./NavbarChannelInfo";
import SectionPongers from "./sections/SectionPongers";
import { Socket } from "socket.io-client";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";
import ChatService from "@/services/Chat.service";

type Props = {
  token:string;
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
};

export default function ChannelInfoCard({
  token,
  channelAndUsersRelation,
  myRelation,
}: Props) {
  const [activeButton, setActiveButton] = useState(0);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const router = useRouter();

  // Chat Websocket call
  useEffect(() => {

	const handleError = () => {
		setSocket(undefined);
	  }

	  const	disconnectClient = async () => {
		await disconnect();
		router.refresh();
	}

	  if (!socket) {
		const intervalId = setInterval(() => {
		  const chatService = new ChatService(token);
		  
				  if (chatService.disconnectClient) {
					  clearInterval(intervalId);
					  disconnectClient();
				  }
  
		  if (chatService.socket) {
			setSocket(chatService.socket);
			clearInterval(intervalId);
		  }
		}, 500);
	  }

	  socket?.on("disconnect", handleError);

	  return () => {
		socket?.off("disconnect", handleError);
	  }

  }, [socket]);


  return (
    <>
      <NavbarChannelInfo
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        myRelation={myRelation}
      />
      {(() => {
        switch (activeButton) {
          case 0:
            return (
              <SectionPongers
                channelAndUsersRelation={channelAndUsersRelation}
                myRelation={myRelation}
              />
            );
          case 1:
            return (
              <div className={styles.sections}>contenu section2 : Channel</div>
            );
          case 2:
            return (
              <div className={styles.sections}>contenu section3 : Custom</div>
            );
          default:
            return (
              <div className={styles.sections}>
                contenu section? : default switch reached
              </div>
            );
        }
      })()}
    </>
  );
}
