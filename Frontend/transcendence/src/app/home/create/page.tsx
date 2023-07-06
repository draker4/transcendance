import { cookies } from "next/dist/client/components/headers";
import fs from "fs";
import FormLogin from "@/components/createLogin/FormLogin";
import Profile_Service from "@/services/Profile.service";

export default async function CreatePage() {
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
  let token: string | undefined = "";

  try {
    token = cookies().get("crunchy-token")?.value;
    if (!token) throw new Error("No token value");

    const profileData = new Profile_Service(token);
    profile = await profileData.getProfileByToken();
  } catch (err) {
    console.log(err);
  }

  let avatars: string[] = [];

  try {
    const directoryPath = "/app/transcendence/public/images/avatars";
    avatars = fs.readdirSync(directoryPath);

    avatars = avatars.map((avatar) => {
      if (avatar.includes("avatar")) return "/images/avatars/" + avatar;
      return avatar;
    });
  } catch (error) {
    console.log(error);
  }

  if (profile.provider === "42") avatars.unshift(profile.image);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <FormLogin token={token as string} avatars={avatars} />
    </div>
  );
}
