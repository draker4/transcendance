import { ChannelRoles } from "@/lib/enums/ChannelRoles.enum";
import Channel_Service from "@/services/Channel.service";
import styles from "@/styles/profile/InfoCard.module.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCertificate,
  faSkull,
  faHand,
  faHandPeace,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import { Socket } from "socket.io-client";
import ConfirmationPannel from "./ConfirmationPannel";

type Props = {
  channelId: number;
  relation: UserRelation;
  myRelation: UserRelation;
  role: ChannelRoles;
  lists: ChannelLists;
  socket: Socket | undefined;
};

type ButtonData = {
  id: number;
  name: string;
  icon: IconProp;
  onClick: () => void;
  colorDep: boolean;
};

type UpdateOptions = {
  isChanOp?: boolean;
  joined?: boolean;
  isBanned?: boolean;
  invited?: boolean;
  onSuccess: () => void;
};

export default function ChanOpControlPannel({
  channelId,
  relation,
  myRelation,
  role,
  lists,
  socket,
}: Props) {
  const channelService = new Channel_Service();

  const [waitingConfirmation, setWaitingConfirmation] =
    useState<boolean>(false);
  const [confirmationList, setConfirmationList] =
    useState<ConfirmationList>("nothing");

  const jumpList = (
    setJumpFrom: Dispatch<SetStateAction<UserRelation[]>>,
    setjumpInto: Dispatch<SetStateAction<UserRelation[]>>,
    relation: UserRelation
  ) => {
    setJumpFrom((prev: UserRelation[]) =>
      prev.filter((user: UserRelation) => user.userId !== relation.userId)
    );
    setjumpInto((prev: UserRelation[]) => [...prev, relation]);
  };

  const sendUpdates = async (options: UpdateOptions) => {
    const {
      isChanOp = undefined,
      joined = undefined,
      isBanned = undefined,
      invited = undefined,
    } = options;
    const rep = await channelService.editRelation(channelId, relation.userId, {
      isChanOp,
      joined,
      isBanned,
      invited,
    });
    if (rep.success) {
      options.onSuccess();

	  socket?.emit("editRelation", {
      channelId: channelId,
      newRelation: {
        isChanOp : options.isChanOp,
        joined : options.joined,
        isBanned : options.isBanned,
        invited : options.invited,
      },
      userId: relation.userId,
    });
	  
    } else {
      lists.setNotif("Error : " + rep.message + " ...try later please");
    }
  };

  const handleChanOp = async () => {
    if (relation.isChanOp) {
      sendUpdates({
        isChanOp: false,
        onSuccess: () => {
          relation.isChanOp = false;
          jumpList(lists.setOperators, lists.setPongers, relation);
        },
      });
    } else {
      sendUpdates({
        isChanOp: true,
        onSuccess: () => {
          relation.isChanOp = true;
          jumpList(lists.setPongers, lists.setOperators, relation);
        },
      });
    }
  };

  const handleKick = () => {
    if (relation.invited) {
      sendUpdates({
        invited: false,
        onSuccess: () => {
          relation.invited = false;
          jumpList(lists.setInvited, lists.setLeavers, relation);
        },
      });
    }
    if (relation.joined) {
      sendUpdates({
        joined: false,
        onSuccess: () => {
          relation.joined = false;
          jumpList(lists.setPongers, lists.setLeavers, relation);
        },
      });
    }
  };

  const handleBan = () => {
    // [1] remove ban
    if (relation.isBanned) {
      // invited or joined
      if (relation.joined) {
        sendUpdates({
          isBanned: false,
          onSuccess: () => {
            relation.isBanned = false;
            jumpList(lists.setBanned, lists.setPongers, relation);
          },
        });
      } else {
        sendUpdates({
          isBanned: false,
          invited: true,
          onSuccess: () => {
            relation.isBanned = false;
            relation.invited = true;
            jumpList(lists.setBanned, lists.setInvited, relation);
          },
        });
      }
      // [2] give ban
    } else if (relation.invited) {
      sendUpdates({
        isBanned: true,
        onSuccess: () => {
          relation.isBanned = true;
          jumpList(lists.setInvited, lists.setBanned, relation);
        },
      });
    } else if (relation.joined) {
      sendUpdates({
        isBanned: true,
        onSuccess: () => {
          relation.isBanned = true;
          jumpList(lists.setPongers, lists.setBanned, relation);
        },
      });
    } else if (!relation.joined) {
      sendUpdates({
        isBanned: true,
        onSuccess: () => {
          relation.isBanned = true;
          jumpList(lists.setLeavers, lists.setBanned, relation);
        },
      });
    }
  };

  const handleInvite = () => {
    if (!relation.invited) {
      sendUpdates({
        invited: true,
        onSuccess: () => {
          relation.invited = true;
          jumpList(lists.setLeavers, lists.setInvited, relation);
        },
      });
    }
  };

  const handleValidate = () => {
    if (confirmationList === "chanOp") handleChanOp();
    else if (confirmationList === "kick") handleKick();
    else if (confirmationList === "ban") handleBan();
    else if (confirmationList === "invite") handleInvite();
    handleCancel();
  };

  const handleCancel = () => {
    setConfirmationList("nothing");
    setWaitingConfirmation(false);
  };

  const chanOpConfirmation = () => {
    setConfirmationList("chanOp");
    setWaitingConfirmation(true);
  };

  const kickConfirmation = () => {
    setConfirmationList("kick");
    setWaitingConfirmation(true);
  };

  const banConfirmation = () => {
    setConfirmationList("ban");
    setWaitingConfirmation(true);
  };

  const inviteConfirmation = () => {
    setConfirmationList("invite");
    setWaitingConfirmation(true);
  };

  const buttonData: ButtonData[] = (() => {
    switch (role) {
      case ChannelRoles.operator:
        if (relation.userId !== myRelation.userId) {
          return [
            {
              id: 0,
              name: "chanOp",
              icon: faCertificate,
              onClick: chanOpConfirmation,
              colorDep: relation.isChanOp,
            },
          ];
        } else return [];

      case ChannelRoles.ponger:
        return [
          {
            id: 0,
            name: "chanOp",
            icon: faCertificate,
            onClick: chanOpConfirmation,
            colorDep: relation.isChanOp,
          },
          {
            id: 1,
            name: "kick",
            icon: faHand,
            onClick: kickConfirmation,
            colorDep: true,
          },
          {
            id: 2,
            name: "ban",
            icon: faSkull,
            onClick: banConfirmation,
            colorDep: !relation.isBanned,
          },
        ];

      case ChannelRoles.invited:
        return [
          {
            id: 0,
            name: "kick",
            icon: faHand,
            onClick: kickConfirmation,
            colorDep: true,
          },
        ];

      case ChannelRoles.banned:
        return [
          {
            id: 0,
            name: "ban",
            icon: faSkull,
            onClick: banConfirmation,
            colorDep: !relation.isBanned,
          },
        ];

      case ChannelRoles.leaver:
        return [
          {
            id: 0,
            name: "invite",
            icon: faHandPeace,
            onClick: inviteConfirmation,
            colorDep: relation.joined,
          },
          {
            id: 1,
            name: "ban",
            icon: faSkull,
            onClick: banConfirmation,
            colorDep: !relation.isBanned,
          },
        ];

      default:
        return [];
    }
  })();

  return (
    <div className={styles.controlPannel}>
      {waitingConfirmation && (
        <ConfirmationPannel
          handleValidate={handleValidate}
          handleCancel={handleCancel}
          confirmationList={confirmationList}
          relation={relation}
        />
      )}

      {!waitingConfirmation &&
        buttonData.map((button) => (
          <FontAwesomeIcon
            className={styles.command}
            key={button.id}
            onClick={button.onClick}
            icon={button.icon}
            style={{
              color: button.colorDep ? "var(--notif)" : "var(--accent1)",
            }}
          />
        ))}
    </div>
  );
}
