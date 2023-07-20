type	Channel = {
	id: number,
	name: string,
	avatar: Avatar,
	type: 'public' | 'protected' | 'private' | 'privateMsg',
	joined: boolean;
};
