import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class logInGuard extends AuthGuard('42') {

	async canActivate(context: ExecutionContext): Promise<boolean> {
		console.log("debut guard");
		const	result: boolean = (await super.canActivate(context)) as boolean;
		console.log("debut guard2");
		const	request = context.switchToHttp().getRequest();
		
		console.log("debut guard3");
		await super.logIn(request);
		console.log("end guard");
		return result;
	}
}
