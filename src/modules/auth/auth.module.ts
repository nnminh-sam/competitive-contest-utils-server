import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ContestantModule } from 'src/modules/contestant/contestant.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { EnvironmentModule } from 'src/environment/environment.module';
import { EnvironmentService } from 'src/environment/environment.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';
import { MailingModule } from 'src/modules/mailing/mailing.module';

@Module({
  imports: [
    MailingModule,
    DatabaseModule,
    EnvironmentModule,
    ContestantModule,
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (
        environmentService: EnvironmentService,
      ): JwtModuleOptions => ({
        secret: environmentService.secret,
        global: true,
        signOptions: { expiresIn: environmentService.expiredIn },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
