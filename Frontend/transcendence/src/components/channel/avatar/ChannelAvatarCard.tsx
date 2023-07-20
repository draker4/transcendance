"use client";
import Avatar from "@/components/profile/avatar/Avatar";
import ProfileLogin from "@/components/profile/avatar/ProfileLogin";
import Avatar_Service from "@/services/Avatar.service";
import styles from "@/styles/profile/AvatarCard.module.css";
import { CSSProperties, useState } from "react";
import { Color } from "react-color";

type Props = {
  userStatus: UserStatusInChannel;
  avatar: Avatar;
  token: string,
};

export default function ChannelAvatarCard({ avatar, userStatus, token }: Props) {

  const [displaySettings, setDisplaySettings] = useState<boolean>(false);
  const [topColor, setTopColor] = useState<Color>(avatar.borderColor);
  const [botColor, setBotColor] = useState<Color>(avatar.backgroundColor);
  const [selectedArea, setSelectedArea] = useState<"border" | "background">(
    "border"
	);

	const avatarService = new Avatar_Service(token);

  const handleArea = (
    newArea: "border" | "background" | null
  ) => {
    if (newArea) setSelectedArea(newArea);
  };

  const toogleDisplaySettings = () => {
    if (!userStatus.chanOp)
      return ;
    if (displaySettings === true) cancelColorChange();
    setDisplaySettings(!displaySettings);
  };

  const saveColorChanges = async () => {

    if (!userStatus.chanOp)
      return ;

    await avatarService.submitAvatarColors(
      topColor.toString(),
      botColor.toString(),
    );

    avatar.borderColor = topColor.toString();
    avatar.backgroundColor = botColor.toString();
    setDisplaySettings(false);
  };

  const colorAddedStyle: CSSProperties = {
    backgroundColor: topColor.toString(),
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
          <div className={styles.top} style={colorAddedStyle}></div>
          <div className={styles.bot}></div>
		  <Avatar
            avatar={avatar}
            isOwner={userStatus.chanOp}
            onClick={toogleDisplaySettings}
            displaySettings={displaySettings}
            previewBorder={topColor.toString()}
            previewBackground={botColor.toString()}
          />
        </div>

        {/* <ProfileLogin name={avatar.} isOwner={false} */}
      </div>
      {/* {displaySettings && (
        <SettingsCard
          previewChangeTopColor={previewChangeTopColor}
          previewChangeBotColor={previewChangeBotColor}
          handleArea={handleArea}
          selectedArea={selectedArea}
          toogleDisplaySettings={toogleDisplaySettings}
          saveColorChanges={saveColorChanges}
        />
      )} */}
    </div>
  );
}
