"use client"

import Profile from "@/services/Profile.service";
import Avatar from "@mui/material/Avatar";

export default function ChooseAvatar({ profile }: {
	profile: Profile
}) {

	const	letters = profile.email.slice(0, 2).toUpperCase();

	return (
		<div>
			<Avatar
				src={profile.image}
				alt={letters}
				variant="circular"
				sx={{
					width: 80,
					height: 80,
					bgcolor: "#b3fb54",
					objectFit: "cover",
					border: "2px solid var(--secondary-color)",
				}}
			>
				{letters}
			</Avatar>
		</div>
	);
}
