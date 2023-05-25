import { jwtVerify} from "jose";
import { getJwtSecretKey } from "./getJwtSecretKey";

interface UserJwtPayload {
	jti: string;
	iat: number;
}

export const verifyAuth = async (token: string) => {

	try {
		const verified = await jwtVerify(
			token,
			new TextEncoder().encode(getJwtSecretKey()),
		);
		
		return verified.payload as UserJwtPayload;

	} catch (error) {
		throw new Error('Your token has expired');
	}
}
