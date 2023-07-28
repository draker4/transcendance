/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from "@nestjs/common";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
	catch(exception: UnauthorizedException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		console.log("here, response=", response, status);
	}
}
