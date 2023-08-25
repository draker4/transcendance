import styles from "@/styles/profile/InfoCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Socket } from "socket.io-client";
import {
	faPlusCircle
  } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Channel_Service from "@/services/Channel.service";
import { EditChannelRelation } from "@/types/Channel-linked/EditChannelRelation";

type Props = {
  relation: ChannelUsersRelation;
  myRelation: UserRelation;
  socket: Socket | undefined;
}

// [+][!] Fichier pour preparer le mecanisme d'invitation dans channel
// A [modifier pour incorporer une searchBar] ou [supprimer une fois le code extrait]

export default function InviteInChannel({relation, myRelation, socket}:Props) {

  const [notif, setNotif] = useState<string>("");
  const targetIds: number[] = [1,2,3,4,5,6,7];

  const handleClickInvite = async (targetId: number) => {
    console.log(`Wanna invite in ${relation.channel.name} user[${targetId}]`);

    try {

      const channelService = new Channel_Service(undefined);

      const newRelation:EditChannelRelation = {
        channelId: relation.channel.id,
        userId: targetId,
        senderId: myRelation.userId,
        newRelation: {
          invited: true,
        }
      }

      const repEdit:ReturnData = await channelService.editRelation(relation.channel.id, targetId, newRelation.newRelation);

      console.log("InviteInChannel => repEdit : ", repEdit); // checking

      if (!repEdit.success)
        throw new Error(repEdit.message);

      // [+] LOUP : CONTINUER ICI
      socket?.emit("editRelation", 
        newRelation, 
        (repNotif:ReturnData) => {
          console.log("InviteInChannel => editRelation => editRelation (WebSocket) => REP : ", repNotif); // checking
          if (!repNotif.success) {
            setNotif(repNotif.message ? repNotif.message : "An error occured, please try again later");
          } else {
            // [+] proc un update a l'user target
            
          } 
      });





    } catch(e:any) {
      setNotif(e.message ? e.message : `An unknown error occured while inviting user ${targetId}, try later please`);
    }


  }

  const makeButtons:JSX.Element[] = targetIds.map((targetId, index) => (
      <p key={index} onClick={() => handleClickInvite(targetId)} className={styles.tinyTitle} style={{marginBottom:"12px"}}>{`invite user ${targetId}`}&thinsp;<FontAwesomeIcon icon={faPlusCircle} /></p>
    ));

  return (
    <>
      <p className={styles.notif}>{notif}</p>
      {makeButtons}
    </>
  )
}
