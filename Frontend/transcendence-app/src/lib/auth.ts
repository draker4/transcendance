import { jwtVerify} from "jose";
import { getJwtSecretKey } from "./getJwtSecretKey";

export const verifyAuth = async (token: string) => {

	try {
		const verified = await jwtVerify(
			token,
			new TextEncoder().encode(getJwtSecretKey()),
		);
		
		return verified.payload;

	} catch (error) {
		throw new Error('Your token has expired');
	}
}

export const getAuthId = async (token: string | undefined): Promise<number> => {

	if (!token)
		throw new Error('Token undefined');

	try {
		const verified = await jwtVerify(
			token,
			new TextEncoder().encode(getJwtSecretKey()),
		);
		
		return verified.payload.id as number;

	} catch (error) {
		throw new Error('Your token has expired');
	}
}
