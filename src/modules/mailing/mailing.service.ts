import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailingService {
  private readonly logger: Logger = new Logger(MailingService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, content: string, html: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: content,
        html: html,
      });
      return true;
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot send OTP email');
    }
  }
}
