import { Injectable, UnauthorizedException } from '@nestjs/common';
import dataAPI42 from 'src/interfaces/dataAPI42.interface';
import { createUserDto } from 'src/users/dto/CreateUser.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async getToken42(code : string): Promise<dataAPI42> {
		const	response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				"grant_type": "authorization_code",
				"client_id": process.env.CLIENT_ID_42,
				"client_secret": process.env.SECRET_42,
				"code": code,
				"redirect_uri": "http://localhost:3000/home"
			})
		})
		
		if (!response.ok)
			throw new UnauthorizedException();

		return await response.json();
	}

	async logUser(dataToken: dataAPI42): Promise<Partial<createUserDto>> {
		const	response = await fetch("https://api.intra.42.fr/v2/me", {
			method: "GET",
			headers: {"Authorization": "Bearer " + dataToken.access_token}
		})

		if (!response.ok)
			throw new UnauthorizedException();
		
		const	content = await response.json();

		const	user: Partial<createUserDto> = {
			login: content?.login,
			first_name: content?.first_name,
			last_name: content?.last_name,
			phone: content?.phone,
			email: content?.email,
			image: content?.image?.link,
		};
		
		return user;
	}
}
