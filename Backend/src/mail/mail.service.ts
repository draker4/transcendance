import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/utils/typeorm/User.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, login: string, code: string) {
    const codeFormated = code.substring(0, 4) + " - " + code.substring(4);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Crunchy Pong! Confirm your Email',
      template: './confirmation',
      context: {
        login,
        code: codeFormated,
      },
    });
  }
}
