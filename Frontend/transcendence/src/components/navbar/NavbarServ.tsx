import { cookies } from "next/dist/client/components/headers";
import { getAvatarByToken } from "@/lib/avatar/getAvatarByToken";
import { CryptoService } from "@/services/crypto/Crypto.service";
import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service";
import NavbarFront from "./NavbarFront";

const Crypto = new CryptoService();

export default async function NavbarServ() {
  let token: string | undefined = "";
  let avatar: avatarType = {
    image: "",
    name: "",
    variant: "",
    borderColor: "",
    backgroundColor: "",
    text: "",
    empty: true,
    isChannel: false,
  };

  let profile = new Profile();

  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const data = await getAvatarByToken(token);
    const profileData = await getProfileByToken(token);

    if (!data.error) {
      avatar = data;
      if (avatar.image && avatar.image.length > 0)
        avatar.image = await Crypto.decrypt(avatar.image);
    }
    if (profileData) profile = profileData;
  } catch (err) {
    console.log(err);
  }

  return (
    <div>
      <NavbarFront avatar={avatar} profile={profile} />
    </div>
  );
}
