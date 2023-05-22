import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-42";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

	constructor(private authService: AuthService) {
		super({
			clientID: process.env.CLIENT_ID_42,
			clientSecret: process.env.SECRET_42,
			callbackURL: "http://localhost:3000",
			scope: "public",
		});
	}

	async validate(
		request: { session: { accessToken: string } },
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		cb: VerifyCallback,
	): Promise<any> {
		request.session.accessToken = accessToken;
		console.log(accessToken, refreshToken);
		return cb(null, profile);
	}
}
