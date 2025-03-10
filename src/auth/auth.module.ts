import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ContestantModule } from 'src/contestant/contestant.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { EnvironmentModule } from 'src/environment/environment.module';
import { EnvironmentService } from 'src/environment/environment.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';

@Module({
  imports: [
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
