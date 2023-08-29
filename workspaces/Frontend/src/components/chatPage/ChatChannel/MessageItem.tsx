import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import makeHumanDateFormat from "@/lib/chat/makeHumanDateFormat";
import { useEffect, useState } from "react";
import chooseColorStatus from "@/lib/colorStatus/chooseColorStatus";
import { Badge, CircularProgress, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv } from "@fortawesome/free-solid-svg-icons";
import InviteButton from "@/components/InviteGame/InviteButton";
import { Socket } from "socket.io-client";

type GroupedMsgType = {
  user: User;
  date: Date;
  messages: Message[];
  isServerNotif: boolean;
  join?: boolean;
};

type Props = {
  groupedMessages: GroupedMsgType;
  status: Map<string, string>;
  myself: Profile & { avatar: Avatar };
  addMsg: (msg: Message) => void;
  channel: Channel;
};

export default function MessageItem({
  groupedMessages,
  status,
  myself,
  addMsg,
  channel,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [color, setColor] = useState<string>("#edf0f0");
  const [textStatus, setTextStatus] = useState<string>("disconnected");
  const [loading, setLoading] = useState<boolean>(false);

  const badgeStyleStatus = {
    "& .MuiBadge-badge": {
      backgroundColor: color,
      border: "1px solid var(--tertiary1)",
      width: "12px",
      height: "12px",
      borderRadius: "100%",
      right: "5px",
    },
  };

  const handleFocusOn = () => {
    setIsFocused(true);
  };

  const handleFocusOff = () => {
    setIsFocused(false);
  };

  const handleHover = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (status && status.size > 0 && !groupedMessages.isServerNotif) {
      if (status.has(groupedMessages.user.id.toString())) {
        const text = status.get(groupedMessages.user.id.toString()) as string;
        setTextStatus(text);
        setColor(chooseColorStatus(text));
      }
    }
  }, [status]);

  const mappingMessages = groupedMessages.messages.map((msg, index) => (
    <pre key={index}>{msg.content}</pre>
  ));

  const formatedDate = makeHumanDateFormat(groupedMessages.date);

  // Server Notif Message
  if (groupedMessages.isServerNotif) {
    return (
      <div className={styles.msgItem}>
        {
          <div className={styles.avatarSide}>
            <div className={styles.notifDate}> {formatedDate} </div>
          </div>
        }
        <div className={styles.textSide}>
          <div className={`${styles.content} ${styles.serverNotif}`}>
            {mappingMessages}
          </div>
        </div>
      </div>
    );
  }

  // User Message
  return (
    <div
      className={styles.msgItem}
      onFocus={handleFocusOn}
      onBlur={handleFocusOff}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >

      {/* Loading */}
      {loading && (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      )}

      {/* Avatar Side */}
      {/* with online status */}
      {
        channel.type !== "privateMsg" && groupedMessages.user.id !== myself.id &&
        <div className={styles.avatarSide}>
          <Tooltip title={textStatus} placement="top" arrow>
            <Badge
              overlap="circular"
              sx={badgeStyleStatus}
              variant="dot"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <div className={styles.avatarSlot}>
                <AvatarUser
                  avatar={groupedMessages.user.avatar}
                  borderSize="3px"
                  borderColor={groupedMessages.user.avatar.borderColor}
                  backgroundColor={groupedMessages.user.avatar.backgroundColor}
                  fontSize="1rem"
                />
              </div>
            </Badge>
          </Tooltip>
        </div>
      }

      {/* without online status */}
      {
        (channel.type === "privateMsg" || groupedMessages.user.id === myself.id) &&
        <div className={styles.avatarSide}>
          <div className={styles.avatarSlot}>
            <AvatarUser
              avatar={groupedMessages.user.avatar}
              borderSize="3px"
              borderColor={groupedMessages.user.avatar.borderColor}
              backgroundColor={groupedMessages.user.avatar.backgroundColor}
              fontSize="1rem"
            />
          </div>
        </div>
      }

      {/* Text Side */}
      <div className={styles.textSide}>
        {/* Header */}
        <div className={styles.tsheader}>
          <div
            className={styles.name}
            style={{ color: groupedMessages.user.avatar.borderColor }}
          >
            {groupedMessages.user.login}
          </div>
          <div className={styles.date}>{formatedDate}</div>
          
            {/* Game invitation */}
            {isFocused &&
            !groupedMessages.isServerNotif &&
            groupedMessages.user.id !== myself.id &&
            !loading && (
              <>
                {textStatus === "connected" &&
                <div className={styles.inviteButton}>
                  <InviteButton
                    setLoading={setLoading}
                    myself={myself}
                    opponentId={groupedMessages.user.id}
                    opponentLogin={groupedMessages.user.login}
                    addMsg={addMsg}
                    isChannel={false}
                  />
                </div>
                }
                {textStatus === "in game" && (
                  <Tooltip title={"watch game"} arrow placement="top">
                    <div className={styles.inviteButton}>
                      <FontAwesomeIcon icon={faTv} className={styles.icon} />
                    </div>
                  </Tooltip>
                )}
              </>
        )}
        </div>

        {/* Content */}
        <div className={styles.flexContentMsg}>
          <div className={styles.content}>
            {mappingMessages}
          </div>
          {
            groupedMessages.join && groupedMessages.user.id !== myself.id &&
            <button type='button'>Join</button>
          }
        </div>

      </div>
    </div>
  );
}
