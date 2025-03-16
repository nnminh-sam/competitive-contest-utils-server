import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EnvironmentModule } from 'src/environment/environment.module';
import { EnvironmentService } from 'src/environment/environment.service';
import { MailingService } from 'src/modules/mailing/mailing.service';

@Module({
  imports: [
    EnvironmentModule,
    MailerModule.forRootAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        return {
          transport: {
            host: environmentService.emailHost,
            port: environmentService.emailPort,
            secure: false, // True for port 465, false for other ports
            auth: {
              user: environmentService.emailUser,
              pass: environmentService.emailPass,
            },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
        };
      },
    }),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
