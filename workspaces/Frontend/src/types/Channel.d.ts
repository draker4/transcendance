type	Channel = {
	id: number;
	name: string;
	avatar: Avatar;
	type: 'public' | 'protected' | 'private' | 'privateMsg';
	isChanOp:boolean;
	joined:boolean;
	invited:boolean;
	banned:boolean;
	lastMessage?: {
		user: User;
		content: string;
		createdAt: Date;
	};
};
