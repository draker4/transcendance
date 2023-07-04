import AvatarUser from "@/components/loggedIn/avatarUser/AvatarUser";
import { ChatSocketContext } from "@/context/ChatSocketContext";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/chat/ChatHome.module.css";

export default function ChatHome() {
  const socket = useContext(ChatSocketContext);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [pongies, setPongies] = useState<Pongie[]>([]);

  useEffect(() => {
    socket?.emit(
      "getChannels",
      (payload: { success: boolean; channels: Channel[] }) => {
        setChannels(payload.channels);
      }
    );
    socket?.emit(
      "getPongies",
      (payload: { success: boolean; pongies: Pongie[] }) => {
        setPongies(payload.pongies);
      }
    );
  }, [socket]);

  return (
    <div>
      <p>Channels</p>
      {channels.length === 0 ? (
        <p>No channels</p>
      ) : (
        <>
          {channels.map((channel) => (
            <div key={channel.id} className={styles.list}>
              <div className={styles.avatar}>
                <AvatarUser
                  avatar={channel.avatar}
                  borderSize="2px"
                  borderColor={channel.avatar.borderColor}
                  backgroundColor={channel.avatar.backgroundColor}
                />
              </div>
              {channel.name}
            </div>
          ))}
        </>
      )}
      <p>Pongies</p>
      {pongies.length === 0 ? (
        <p>No pongies</p>
      ) : (
        <>
          {pongies.map((pongie) => (
            <div key={pongie.id} className={styles.list}>
              <div className={styles.avatar}>
                <AvatarUser
                  avatar={pongie.avatar}
                  borderSize="2px"
                  borderColor={pongie.avatar.borderColor}
                  backgroundColor={pongie.avatar.backgroundColor}
                />
              </div>
              {pongie.login}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
