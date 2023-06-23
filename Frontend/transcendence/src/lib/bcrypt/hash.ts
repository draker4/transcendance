import * as bcrypt from 'bcrypt';

export default async function hash(data: string) {
	const	salt = await bcrypt.genSalt();

	return await bcrypt.hash(data, salt);
}
