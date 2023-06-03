import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

export class Emailer {
	private readonly transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			port: 465,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		});
	}

	public	sendEmail(mailOptions: MailOptions) {
		return this.transporter.sendMail(mailOptions);
	}

	public	verifyUserInscription(email: string, login: string) {
		console.log("je suis la login=", login);
		this.sendEmail(verifyUserInscription(email, login));
	}
}

export const	emailer = new Emailer();

export const	verifyUserInscription = (email: string, login: string) => {
	return {
		from: process.env.SMTP_USER,
		to: email,
		subject: `${login}, Validate inscription to Crunchy-Pong`,
		text: "Welcome to our website!",
		html:	`
				<p>Welcome to <strong>Crunchy-Pong</strong> website!</p>
				<br>
				<p>Please ${login}, enter this following code to validate your email!</p>
				`,
	} as MailOptions;
}
