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

      if (!repEdit.success)
        throw new Error(repEdit.message);

      socket?.emit("editRelation", 
        newRelation, 
        (repNotif:ReturnData) => {
          if (!repNotif.success) {
            toast.error("An error occured, please try again later!");
          }
      });

    } catch(e:any) {
      toast.error(e.message === "Invitation is already done" ? `This ponger is already invited in ${relation.channel.name}` : "An error occured, please try again later!");
    }
  }

  return <SearchBarPongies
            socket={socket}
            handleClickInvite={handleClickInvite}
            placeholder="Invite someone..."
          />
}
