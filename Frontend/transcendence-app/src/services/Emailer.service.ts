import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

export class Emailer {
	private readonly transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASSWORD,
			},
		});
	}

	public	sendEmail(mailOptions: MailOptions) {
		return this.transporter.sendMail(mailOptions);
	}

	public	verifyUserInscription(email: string, login: string) {
		this.sendEmail(verifyUserInscription(email, login));
	}
}

export const	emailer = new Emailer();

export const	verifyUserInscription = (email: string, login: string) => {
	return {
		from: process.env.GMAIL_USER,
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
