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
    id: number;
  };
};

const Crypto = new CryptoService();

export default async function ProfilByIdPage({ params: { id } }: Params) {
  let isProfilOwner: boolean = false;
  let avatar: Avatar = {
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

    if (myProfile.id === id) {
      targetProfile = myProfile;
    } else {
      targetProfile = await profileService.getProfileById(id);
    }

	if (targetProfile.id < 0)
		throw new Error(`user id : ${targetProfile.id}`);

    const avatarService = new Avatar_Service(token);

    avatar = await avatarService.getAvatarbyUserId(targetProfile.id);

    const payload = await verifyAuth(token);

    if (payload.sub?.toString() === id.toString()) isProfilOwner = true;
  } catch (err) {
    console.log(err);
    return <ErrorProfile params={{id}}/>;
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
    return <ErrorProfile params={{id}}/>;
  }
}
