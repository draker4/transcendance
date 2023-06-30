import ProfileMainFrame from "@/components/loggedIn/profile/ProfileMainFrame";
import { verifyAuth } from "@/lib/auth/auth";
import { getProfileByLogin } from "@/lib/profile/getProfileInfos";
import Avatar_Service from "@/services/Avatar.service";
import { CryptoService } from "@/services/crypto/Crypto.service";
import Profile from "@/services/Profile.service";
import styles from "@/styles/loggedIn/profile/Profile.module.css";
import avatarType from "@/types/Avatar.type";
import { cookies } from "next/dist/client/components/headers";

// [!] cette foncion devra etre supprimee a terme
import { getAvatarByLogin } from "@/lib/avatar/getAvatarByLogin";

type Params = {
  params: {
    login: string;
  };
};

const Crypto = new CryptoService();

export default async function ProfilByIdPage({ params: { login } }: Params) {
  let profile = new Profile();
  let isProfilOwner: boolean = false;
  let avatar: avatarType = {
    name: "",
    image: "",
    variant: "",
    borderColor: "",
    backgroundColor: "",
    text: "",
    empty: true,
    isChannel: false,
  };

  try {
    const token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    profile = await getProfileByLogin(token, login);

    const Avatar = new Avatar_Service(token);

    avatar = await Avatar.getAvatarByName(login);

    if (avatar.image.length > 0)
      avatar.image = await Crypto.decrypt(avatar.image);

    const payload = await verifyAuth(token);

    if (payload.login === decodeURIComponent(login)) isProfilOwner = true;
  } catch (err) {
    console.log(err);
  }

  return (
    <main className={styles.main}>
      <ProfileMainFrame
        profile={profile}
        avatar={avatar}
        isOwner={isProfilOwner}
      />
    </main>
  );
}
