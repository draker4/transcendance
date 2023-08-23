import styles from "@/styles/profile/AvatarCard.module.css";
import Avatar from "./Avatar";
import ProfileLogin from "./ProfileLogin";
import { CSSProperties, useEffect, useState } from "react";
import SettingsCard from "./SettingsCard";
import { Color } from "react-color";
import Avatar_Service from "@/services/Avatar.service";
import { Socket } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AvatarUser from "@/components/avatarUser/AvatarUser";

type Props = {
  login: string;
  isOwner: boolean;
  avatar: Avatar;
  socket: Socket | undefined;
  avatars: Avatar[];
};

export default function AvatarCard({ login, isOwner, avatar, socket, avatars }: Props) {
  const [displaySettings, setDisplaySettings] = useState<boolean>(false);
  const [notif, setNotif] = useState<string>("");
  const [topColor, setTopColor] = useState<Color>(avatar.borderColor);
  const [botColor, setBotColor] = useState<Color>(avatar.backgroundColor);
  const [avatarChosen, setAvatarChosen] = useState<Avatar>(avatar);
  const [avatarUser, setAvatarUser] = useState<Avatar>(avatar);
  const [selectedArea, setSelectedArea] = useState<"border" | "background">(
    "border"
  );

  const avatarService = new Avatar_Service();

  const handleArea = (newArea: "border" | "background" | null) => {
    if (newArea) setSelectedArea(newArea);
  };

  const toogleDisplaySettings = () => {
    if (!isOwner)
      return;
    if (displaySettings === true)
      cancelColorChange();
    setDisplaySettings(!displaySettings);
  };

  const saveColorChanges = async () => {
    if (!isOwner) return;

    try {
      const rep = await avatarService.submitAvatarUser(
        avatarChosen,
        topColor as string,
        botColor as string,
      );

      if (!rep.success)
        throw new Error(rep.message);

      setAvatarUser({
        ...avatarChosen,
        backgroundColor: botColor.toString(),
        borderColor: topColor.toString(),
      });
      setDisplaySettings(false);

      socket?.emit("notif", {
        why: "updateProfile",
      });
    } catch (e: any) {
      // setNotif("Profile Avatar ColorChanges error : " + e.message);
      toast.error("Something went wrong, please try again!");
    }
  };

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
    setTopColor(avatarUser.borderColor);
    setBotColor(avatarUser.backgroundColor);
    setAvatarChosen(avatarUser);
  };

  const changeAvatar = (dir: string) => {
    if (avatars.length === 0 || (dir !== "right" && dir !== "left"))
      return ;

    let index = -1;

    for (index; index < avatars.length; index++) {
      if (index === -1)
        continue;
      console.log(avatars[index], avatarChosen);
      if (avatarChosen.image.length !== 0
        && avatars[index].image === avatarChosen.image)
        break;
      if (avatarChosen.empty && avatars[index].empty)
        break ;
      if (avatarChosen.image.length === 0 && avatarChosen.text === avatars[index].text)
        break ;
    }

    if (index === 6 || index === -1)
      return ;

    let newAvatar: Avatar;
    if (dir === "right") {
      if (index !== avatars.length - 1)
        newAvatar = avatars[index + 1];
      else
        newAvatar = avatars[0];
    }
    
    else {
      if (index !== 0)
        newAvatar = avatars[index - 1];
      else
        newAvatar = avatars[avatars.length - 1];
    }

    if (newAvatar) {
      setAvatarChosen(newAvatar);
    }
  }

  useEffect(() => {
    avatars.forEach(avatar => {
      if (avatar.text.length !== 0)
        avatar.text = login.toUpperCase().slice(0, 3);
    });
    if (avatarChosen.text.length !== 0) {
      const newAvatar = {...avatarChosen};
      newAvatar.text = login.toUpperCase().slice(0, 3);
      setAvatarChosen(newAvatar);
    }
    if (avatarUser.text.length !== 0) {
      const newAvatar = {...avatarChosen};
      newAvatar.text = login.toUpperCase().slice(0, 3);
      setAvatarUser(newAvatar);
    }
  }, [login]);

  return (
    <div className={styles.avatarFrame}>
      <div className={styles.avatarCard}>
        <div className={styles.rectangle} style={colorAddedStyle}>
          
          {
            displaySettings &&
            <>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={styles.icon}
                onClick={() => changeAvatar("left")}
              />
                <Avatar
                  avatar={avatarChosen}
                  isOwner={isOwner}
                  onClick={toogleDisplaySettings}
                  previewBorder={topColor.toString()}
                  previewBackground={botColor.toString()}
                />
              <FontAwesomeIcon
                icon={faChevronRight}
                className={styles.icon}
                onClick={() => changeAvatar("right")}
              />
            </>
          }

          {
            !displaySettings &&
            <Avatar
              avatar={avatarUser}
              isOwner={isOwner}
              onClick={toogleDisplaySettings}
              previewBorder={topColor.toString()}
              previewBackground={botColor.toString()}
            />
          }

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
