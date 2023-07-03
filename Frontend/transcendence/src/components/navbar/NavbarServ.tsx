import { cookies } from "next/dist/client/components/headers";
import Avatar_Service from "@/services/Avatar.service";

import NavbarFront from "./NavbarFront";
import Profile_Service from "@/services/Profile.service";
import { headers } from "next/headers";

export default async function NavbarServ() {

  const url = headers().get('referer') || "";
  let avatar: Avatar = {
    image: "",
    name: "",
    variant: "circular",
    borderColor: "#22d3ee",
    backgroundColor: "#22d3ee",
    text: "",
    empty: true,
    isChannel: false,
  };

  let profile: Profile = {
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

      const profileData = new Profile_Service(token);
      profile = await profileData.getProfileByToken();

      const Avatar = new Avatar_Service(token);
      avatar = await Avatar.getAvatarByName(profile.login);

  } catch (err) {
    // console.log(err);
  }

  return (
    <div>
      <NavbarFront avatar={avatar} profile={profile} />
    </div>
  );
}
