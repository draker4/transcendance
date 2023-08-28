import { Socket } from "socket.io-client";
import Channel_Service from "@/services/Channel.service";
import { EditChannelRelation } from "@/types/Channel-linked/EditChannelRelation";
import SearchBarPongies from "@/components/chatPage/searchBar/SearchBarPongies";
import { toast } from "react-toastify";

type Props = {
  relation: ChannelUsersRelation;
  myRelation: UserRelation;
  socket: Socket | undefined;
}

export default function InviteInChannel({relation, myRelation, socket}:Props) {

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
            toast.error("An error occured, please try again later!");
          } else {
            // [+] proc un update a l'user target
            
          } 
      });

    } catch(e:any) {
      toast.error("An error occured, please try again later!");
    }


  }

  return <SearchBarPongies
            socket={socket}
            handleClickInvite={handleClickInvite}
            placeholder="Invite someone..."
          />
}
