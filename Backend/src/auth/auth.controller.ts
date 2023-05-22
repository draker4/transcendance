import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { logInGuard } from 'src/guards/logIn.guard';

@Controller('auth')
export class AuthController {

	@Get('42')
	@UseGuards(logInGuard)
	logIn42() {
		console.log("student logged in");
	}

	@Get('42/return')
	@UseGuards(logInGuard)
	@Redirect("/")
	return42() {
		console.log("haha");
	}
}
