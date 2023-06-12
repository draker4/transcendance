import avatarType from "@/types/Avatar.type"
import Avatar from "@mui/material/Avatar"

export default function AvatarUser({ avatar }: {
	avatar: avatarType,
}) {

	let	type: number = 0;

	try {
		if (avatar.image.length > 0)
			type = 1;
		
		else if (avatar.text.length > 0)
			type = 2;
		
		else if (avatar.empty)
			type = 3;
		
		else
			throw new Error('No avatar type found');
	} catch (error) {
		console.log(error);
	}

	return (
		<>
			{
				type === 1 &&
				<Avatar
					src={avatar.image}
					alt={avatar.text}
					variant="circular"
					sx={{
						width: "100%",
						height: "100%",
						border: `3px solid ${avatar.borderColor}`,
					}}
				>
					{avatar.text}
				</Avatar>
			}
			{
				type === 3 &&
				<Avatar
				variant="circular"
					sx={{
						width: "100%",
						height: "100%",
						border: `3px solid ${avatar.borderColor}`,
					}}
				></Avatar>
			}
		</>
	);
}
