import avatarType from "@/types/Avatar.type";
import Avatar from "@mui/material/Avatar";

export default function AvatarUser({
  avatar,
  borderSize,
  backgroundColor,
  borderColor,
}: {
  avatar: avatarType;
  borderSize: string;
  backgroundColor: string;
  borderColor: string;
}) {
  return (
    <>
      {avatar.empty ? (
        <Avatar
          variant="circular"
          sx={{
            width: "100%",
            height: "100%",
            borderWidth: borderSize,
            borderStyle: "solid",
            borderColor: `${borderColor}`,
            backgroundColor: `${backgroundColor}`,
          }}
        ></Avatar>
      ) : (
        <Avatar
          src={avatar.image}
          variant="circular"
          sx={{
            width: "100%",
            height: "100%",
            borderWidth: borderSize,
            borderStyle: "solid",
            borderColor: `${borderColor}`,
            backgroundColor: `${backgroundColor}`,
          }}
        >
          {avatar.text}
        </Avatar>
      )}
    </>
  );
}
