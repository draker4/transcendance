import avatarType from "@/types/Avatar.type"
import Avatar from "@mui/material/Avatar"

export default function AvatarUser({ avatar }: {
	avatar: avatarType,
}) {
	
	return (
		<>
		{
				avatar.empty ? (
					<Avatar
						variant="circular"
						sx={{
							width: "100%",
							height: "100%",
							border: `3px solid ${avatar.borderColor}`,
							backgroundColor: `${avatar.backgroundColor}`,
						}}
					>
					</Avatar>
				) : (
					<Avatar
						src={avatar.image}
						variant="circular"
						sx={{
							width: "100%",
							height: "100%",
							border: `3px solid ${avatar.borderColor}`,
							backgroundColor: `${avatar.backgroundColor}`,
						}}
					>
						{avatar.text}
					</Avatar>
				)
			}
		</>
	);
}
