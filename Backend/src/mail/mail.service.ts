/* eslint-disable prettier/prettier */
// import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import { User } from 'src/utils/typeorm/User.entity';

@Injectable()
export class MailService {
  // constructor(private mailerService: MailerService) {}

  // async sendUserConfirmation(email: string, code: string) {
  //   const codeFormated = code.substring(0, 4) + " - " + code.substring(4);

  //   await this.mailerService.sendMail({
  //     to: email,
  //     subject: 'Welcome to Crunchy Pong! Confirm your Email',
  //     template: './confirmation',
  //     context: {
  //       code: codeFormated,
  //     },
  //   });
  // }

  private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		}, {
			from: '"No Reply" <crunchypong42@gmail.com>',
		});
	}

  async sendUserConfirmation(email: string, code: string) {
    const codeFormated = code.substring(0, 4) + " - " + code.substring(4);

    return this.transporter.sendMail({
      to: email,
      subject: 'Welcome to Crunchy Pong! Confirm your Email',
      html: `<p>Welcome to Crunchy Pong!</p><p>In order to finalize your registration,</p><p>Please enter this code to confirm your email:</p><p>${codeFormated}</p><p>If you did not request this email you can safely ignore it.</p>`,
    });
  }
  
	async sendMail(mailOptions: nodemailer.SendMailOptions) {
		return this.transporter.sendMail(mailOptions);
	}
}
