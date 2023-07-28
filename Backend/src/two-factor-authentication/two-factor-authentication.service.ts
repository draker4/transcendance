/* eslint-disable prettier/prettier */
import { MailService } from "@/mail/mail.service";
import { UsersService } from "@/users/users.service";
import { CryptoService } from "@/utils/crypto/crypto";
import { User } from "@/utils/typeorm/User.entity";
import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { authenticator } from "otplib";

@Injectable()
export class TwoFactorAuthenticationService {

	constructor(
		private readonly usersService: UsersService,
		private readonly cryptoService: CryptoService,
		private readonly mailService: MailService,
	) {}

	public async generateTwoFactorAuthenticationSecret(user: User) {
		
		const	secret = authenticator.generateSecret();
		const	email = await this.cryptoService.decrypt(user.email);

		const	otpauthUrl = authenticator.keyuri(
			email,
			process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
			secret,
		);

		await this.usersService.updateUser(user.id, {
			twoFactorAuthenticationSecret: secret,
		});

		return {
			otpauthUrl,
			secret,
		};
	}

	async sendMail(user: User) {
		const	chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		const	bytes = randomBytes(8);
		const	verifyCode = Array.from(bytes, (byte) => chars[byte % chars.length]).join('');

		const email = await this.cryptoService.decrypt(user.email);
	
		await this.mailService.sendUser2faVerification(email, verifyCode);
		
		await this.usersService.updateUser(user.id, {
			expirationCode: Date.now() + 5 * 60 * 1000,
			verifyCode,
		});
	}

	public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFactorAuthenticationSecret,
		});
	}

	private generateBackupCode(length: number): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		const bytes = randomBytes(length);
		const backupCode = Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
		return backupCode;
	}

	public generateBackupCodes(count: number, length: number): string[] {
		const backupCodes: string[] = [];

		for (let i = 0; i < count; i++) {
		  backupCodes.push(this.generateBackupCode(length));
		}
		
		return backupCodes;
	}
}
