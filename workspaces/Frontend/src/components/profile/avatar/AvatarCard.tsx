import styles from "@/styles/profile/AvatarCard.module.css";
import Avatar from "./Avatar";
import ProfileLogin from "./ProfileLogin";
import { CSSProperties, useState } from "react";
import SettingsCard from "./SettingsCard";
import { Color } from "react-color";
import Avatar_Service from "@/services/Avatar.service";
import { Socket } from "socket.io-client";

type Props = {
  login: string;
  isOwner: boolean;
  avatar: Avatar;
  socket: Socket | undefined;
};

export default function AvatarCard({ login, isOwner, avatar, socket }: Props) {
  const [displaySettings, setDisplaySettings] = useState<boolean>(false);
  const [notif, setNotif] = useState<string>("");
  const [topColor, setTopColor] = useState<Color>(avatar.borderColor);
  const [botColor, setBotColor] = useState<Color>(avatar.backgroundColor);
  const [selectedArea, setSelectedArea] = useState<"border" | "background">(
    "border"
  );

  const avatarService = new Avatar_Service();

  const handleArea = (newArea: "border" | "background" | null) => {
    if (newArea) setSelectedArea(newArea);
  };

  const toogleDisplaySettings = () => {
    if (!isOwner) return;
    if (displaySettings === true) cancelColorChange();
    setDisplaySettings(!displaySettings);
  };

  const saveColorChanges = async () => {
    if (!isOwner) return;

    try {
      const rep = await avatarService.submitAvatarColors(
        topColor.toString(),
        botColor.toString(),
        0
      );

      if (!rep.success) throw new Error(rep.message);

      avatar.borderColor = topColor.toString();
      avatar.backgroundColor = botColor.toString();
      setDisplaySettings(false);

      socket?.emit("notif", {
        why: "updateProfile",
      });
    } catch (e: any) {
      setNotif("Profile Avatar ColorChanges error : " + e.message);
    }
  };

  // backgroundColor: topColor.toString(),
  const colorAddedStyle: CSSProperties = {
    background: `linear-gradient(to bottom, ${topColor.toString()} 60%, var(--primary1) 40%)`,
  };

  const previewChangeTopColor = (color: string) => {
    setTopColor(color);
  };

  const previewChangeBotColor = (color: string) => {
    setBotColor(color);
  };

  const cancelColorChange = () => {
    setTopColor(avatar.borderColor);
    setBotColor(avatar.backgroundColor);
  };

  return (
    <div className={styles.avatarFrame}>
      <div className={styles.avatarCard}>
        <div className={styles.rectangle} style={colorAddedStyle}>
          {/* <div className={styles.top} style={colorAddedStyle}></div>
          <div className={styles.bot}></div> */}
          <Avatar
            avatar={avatar}
            isOwner={isOwner}
            onClick={toogleDisplaySettings}
            displaySettings={displaySettings}
            previewBorder={topColor.toString()}
            previewBackground={botColor.toString()}
          />
        </div>
      </div>
      <ProfileLogin name={login} isOwner={isOwner} />
      {<p className={styles.notif}>{notif}</p>}
      {displaySettings && (
        <SettingsCard
          previewChangeTopColor={previewChangeTopColor}
          previewChangeBotColor={previewChangeBotColor}
          handleArea={handleArea}
          selectedArea={selectedArea}
          toogleDisplaySettings={toogleDisplaySettings}
          saveColorChanges={saveColorChanges}
        />
      )}
    </div>
  );
}
