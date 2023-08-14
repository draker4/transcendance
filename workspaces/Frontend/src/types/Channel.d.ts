type	Channel = {
	id: number;
	name: string;
	avatar: Avatar;
	type: 'public' | 'protected' | 'private' | 'privateMsg';
	isBoss:boolean;
	isChanOp:boolean;
	joined:boolean;
	invited:boolean;
	isBanned:boolean;
	lastMessage?: {
		user: User;
		content: string;
		createdAt: Date;
	};
};
