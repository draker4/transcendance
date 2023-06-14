import avatarType from "@/types/Avatar.type"
import Avatar from "@mui/material/Avatar"

export default function AvatarUser({ avatar, borderSize }: {
	avatar: avatarType,
	borderSize: string,
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
							borderWidth: borderSize,
							borderStyle: 'solid',
							borderColor: `${avatar.borderColor}`,
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
							borderWidth: borderSize,
							borderStyle: 'solid',
							borderColor: `${avatar.borderColor}`,
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
