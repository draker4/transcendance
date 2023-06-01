import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dataAPI42 from 'src/interfaces/dataAPI42.interface';
import { User } from 'src/typeorm/User.entity';
import { createUserDto } from 'src/users/dto/CreateUser.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async getToken42(code : string): Promise<dataAPI42> {
		const	response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				"grant_type": "authorization_code",
				"client_id": process.env.CLIENT_ID_42,
				"client_secret": process.env.SECRET_42,
				"code": code,
				"redirect_uri": "http://localhost:3000/42"
			})
		})
		
		if (!response.ok)
			throw new UnauthorizedException();

		return await response.json();
	}

	async logUser(dataToken: dataAPI42): Promise<User> {
		const	response = await fetch("https://api.intra.42.fr/v2/me", {
			method: "GET",
			headers: {"Authorization": "Bearer " + dataToken.access_token}
		})

		if (!response.ok)
			throw new UnauthorizedException();
		
		const	content = await response.json();

		const	user: createUserDto = {
			login: content?.login,
			first_name: content?.first_name,
			last_name: content?.last_name,
			phone: content?.phone,
			email: content?.email,
			image: content?.image?.link,
		};

		// update or save user in database
		const	user_old = await this.usersService.getUserByLogin(user?.login);
		
		if (!user_old)
			return await this.usersService.addUser(user);
		
		
		return await this.usersService.updateUser(user_old);
	}

	async validateUser(login: string, username: string, password: string): Promise<any> {
		const	user = await this.usersService.getUserByLogin(login);

		if (user)
			return user;
		return null;
	}

	async login(user: User) {
		const	payload = { login: user.login, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload)
		};
	}

	// async addUser(user: Partial<User>) {
	// 	const	user = this.usersService.addUser(user);
	// }
}
