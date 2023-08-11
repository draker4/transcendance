"use client";
import Avatar from "@/components/profile/avatar/Avatar";
import ProfileLogin from "@/components/profile/avatar/ProfileLogin";
import SettingsCard from "@/components/profile/avatar/SettingsCard";
import Avatar_Service from "@/services/Avatar.service";
import styles from "@/styles/profile/AvatarCard.module.css";
import { CSSProperties, useState } from "react";
import { Color } from "react-color";

type Props = {
	channelAndUsersRelation: ChannelUsersRelation;
	myRelation:UserRelation;
	token:string;
  };

export default function ChannelAvatarCard({ channelAndUsersRelation, myRelation, token }: Props) {

  const [displaySettings, setDisplaySettings] = useState<boolean>(false);
  const [topColor, setTopColor] = useState<Color>(channelAndUsersRelation.channel.avatar.borderColor);
  const [botColor, setBotColor] = useState<Color>(channelAndUsersRelation.channel.avatar.backgroundColor);
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
    if (!myRelation.isChanOp)
      return ;
    if (displaySettings === true) cancelColorChange();
    setDisplaySettings(!displaySettings);
  };

  const saveColorChanges = async () => {

    if (!myRelation.isChanOp)
      return ;

    try {
      await avatarService.submitAvatarColors(
        topColor.toString(),
        botColor.toString(),
      channelAndUsersRelation.channel.id,
      );
  
      channelAndUsersRelation.channel.avatar.borderColor = topColor.toString();
      channelAndUsersRelation.channel.avatar.backgroundColor = botColor.toString();
    } catch(e:any) {
      // [+] error management ?
      console.log("Channel saveColorChanges() error : " + e.message);
    }
    setDisplaySettings(false);
  };

  const colorAddedStyle: CSSProperties = {
    background: `linear-gradient(to bottom, ${topColor.toString()} 60%, var(--primary1) 40%)`
  };

  const previewChangeTopColor = (color: string) => {
    setTopColor(color);
  };

  const previewChangeBotColor = (color: string) => {
    setBotColor(color);
  };

  const cancelColorChange = () => {
    setTopColor(channelAndUsersRelation.channel.avatar.borderColor);
    setBotColor(channelAndUsersRelation.channel.avatar.backgroundColor);
  };


  return (
    <div className={styles.avatarFrame}>
      <div className={styles.avatarCard}>
        <div className={styles.rectangle} style={colorAddedStyle}>
       {/*   <div className={styles.top} style={colorAddedStyle}></div>
          <div className={styles.bot}></div> */}
		  <Avatar
            avatar={channelAndUsersRelation.channel.avatar}
            isOwner={myRelation.isChanOp}
            onClick={toogleDisplaySettings}
            displaySettings={displaySettings}
            previewBorder={topColor.toString()}
            previewBackground={botColor.toString()}
          />
        </div>

      </div>
        <ProfileLogin name={channelAndUsersRelation.channel.name} isOwner={myRelation.isChanOp} />
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
