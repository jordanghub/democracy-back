import { Injectable, Inject } from '@nestjs/common';
import { User } from 'src/users/models/user.entity';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  constructor(
    @Inject('MAILER_PROVIDER') private readonly emailProvider: Mail,
  ) {}
  async registerConfirmationEmail(user: User) {
    try {
      await this.emailProvider.sendMail({
        from: 'noreply@democracy.fr',
        to: user.email,
        html: `
          Bonjour et bienvenue,
          Pour valider votre inscription, veuillez cliquer <a href="http://192.168.1.22:8000/email-verification?token=${user.validationToken}">ici</a>
          Si vous n'êtes pas à l'origine de cette action, vous pouvez simplement ignorer ce message
          `,
        subject: 'Confirmation votre inscription',
      });
    } catch (e) {
      console.log(e);
    }
  }
}
