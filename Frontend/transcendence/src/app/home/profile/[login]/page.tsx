import ProfileMainFrame from "@/components/profile/ProfileMainFrame";
import { Refresher } from "@/components/refresher/Refresher";
import { verifyAuth } from "@/lib/auth/auth";
import Avatar_Service from "@/services/Avatar.service";
import Profile_Service from "@/services/Profile.service";
import { CryptoService } from "@/services/crypto/Crypto.service";
import styles from "@/styles/profile/Profile.module.css";
import { cookies } from "next/dist/client/components/headers";
import ErrorProfile from "@/components/profile/ErrorProfile";

type Params = {
  params: {
    login: string;
  };
};

const Crypto = new CryptoService();

export default async function ProfilByIdPage({ params: { login } }: Params) {
  let isProfilOwner: boolean = false;
  let avatar: Avatar = {
    name: "",
    image: "",
    variant: "",
    borderColor: "",
    backgroundColor: "",
    text: "",
    empty: true,
    isChannel: false,
    decrypt: false,
  };
  let myProfile: Profile = {
    id: -1,
    login: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image: "",
    provider: "",
    motto: "",
    story: "",
  };

  let targetProfile: Profile = {
    id: -1,
    login: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image: "",
    provider: "",
    motto: "",
    story: "",
  };
  try {
    const token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const profileService = new Profile_Service(token);
    myProfile = await profileService.getProfileByToken();

    if (myProfile.login === login) {
      targetProfile = myProfile;
    } else {
      targetProfile = await profileService.getProfileByLogin(login);
    }

    const Avatar = new Avatar_Service(token);
	// [+] continuer ici !!!
    avatar = await Avatar.getAvatarByName(login);

    const payload = await verifyAuth(token);

    if (payload.login === decodeURIComponent(login)) isProfilOwner = true;
  } catch (err) {
    console.log(err);
    return <ErrorProfile params={{login}}/>;
  }

  if (targetProfile.id !== -1) {
    return (
      <main className={styles.main}>
        <Refresher />
        <ProfileMainFrame
          profile={targetProfile}
          avatar={avatar}
          isOwner={isProfilOwner}
        />
      </main>
    );
  } else {
    return <ErrorProfile params={{login}}/>;
  }
}
