import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailingService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, content: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: content,
        html: `<p>${content}</p>`,
      });
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
