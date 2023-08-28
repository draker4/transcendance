import styles from "@/styles/chatPage/ChatChannel/ChatChannel.module.css";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import makeHumanDateFormat from "@/lib/chat/makeHumanDateFormat";
import { useEffect, useState } from "react";
import chooseColorStatus from "@/lib/colorStatus/chooseColorStatus";
import { Badge, CircularProgress, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faTv, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  MdStar,
  Md3GMobiledata,
  Md5G,
  MdQuestionMark,
} from "react-icons/md";

type GroupedMsgType = {
  user: User;
  date: Date;
  messages: Message[];
  isServerNotif: boolean;
};

type Props = {
  groupedMessages: GroupedMsgType;
  status: Map<string, string>;
  myself: Profile & { avatar: Avatar };
};

export default function MessageItem({ groupedMessages, status, myself }: Props) {
  
  const [isFocused, setIsFocused] = useState(false);
  const	[color, setColor] = useState<string>("#edf0f0");
  const	[textStatus, setTextStatus] = useState<string>("disconnected");
  const [inviteGame, setInviteGame] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const badgeStyleStatus = {
    "& .MuiBadge-badge": {
      backgroundColor: color,
      border: "1px solid var(--tertiary1)",
      width: "12px",
      height: "12px",
      borderRadius: "100%",
      right: "5px",
    }
  }

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

  const sendInvitation = (gameType: "classic" | "best 3" | "best 5" | "random") => {
    setLoading(true);

    setTimeout(() => {
        setLoading(false);
    }, 2000);
    console.log(gameType);
  }

  useEffect(() => {
  
    if (status && status.size > 0 && !groupedMessages.isServerNotif) {

      if (status.has(groupedMessages.user.id.toString())) {
        const	text = status.get(groupedMessages.user.id.toString()) as string;
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
    <div className={styles.msgItem}
      onFocus={handleFocusOn}
      onBlur={handleFocusOff}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}>

      {/* Game invitation */}
      {
        isFocused && !groupedMessages.isServerNotif && groupedMessages.user.id !== myself.id && !loading &&
        <>
          {
            textStatus === "connected" &&
            <>
              {
                !inviteGame &&
                <Tooltip title={"game invitation"} arrow placement="top">
                  <div className={styles.statusButtons} onClick={() => setInviteGame(!inviteGame)}>
                    <FontAwesomeIcon
                      icon={faGamepad}
                      className={styles.icon}
                    />
                  </div>
                </Tooltip>
              }
              {
                inviteGame &&
                <div className={styles.statusButtons} style={{
                  width: "30%"
                }}>

                  <Tooltip title={"classic"} arrow placement="top">
                    <span className={styles.icon}>
                      <MdStar className={styles.icon} onClick={() => sendInvitation("classic")} />
                    </span>
                  </Tooltip>

                  <Tooltip title={"best 3"} arrow placement="top">
                    <span className={styles.icon}>
                      <Md3GMobiledata className={styles.icon} onClick={() => sendInvitation("best 3")} />
                    </span>
                  </Tooltip>
                  
                  <Tooltip title={"best 5"} arrow placement="top">
                    <span className={styles.icon}>
                      <Md5G className={styles.icon} onClick={() => sendInvitation("best 5")} />
                    </span>
                  </Tooltip>
                  
                  <Tooltip title={"random"} arrow placement="top">
                    <span className={styles.icon}>
                      <MdQuestionMark className={styles.icon} onClick={() => sendInvitation("random")} />
                    </span>
                  </Tooltip>

                  <Tooltip title={"cancel"} arrow placement="top">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className={styles.icon}
                      onClick={() => setInviteGame(!inviteGame)}
                    />
                  </Tooltip>
                </div>
              }
            </>
          }
          {
            textStatus === "in game" && !inviteGame &&
            <Tooltip title={"watch game"} arrow placement="top">
              <div className={styles.statusButtons}>
                <FontAwesomeIcon
                  icon={faTv}
                  className={styles.icon}
                />
              </div>
            </Tooltip>
          }
        </>
      }

      {/* Loading */}
      {
        loading &&
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      }

      {/* Avatar Side */}
      {
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
        </div>
        {/* Content */}
        <div className={styles.content}>{mappingMessages}</div>
      </div>
    </div>
  );
}
