import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { AuthPayload } from './dto/jwt-claim.dto';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { ContestantService } from 'src/modules/contestant/contestant.service';
import { Contestant } from 'src/models/contestant.model';
import { RedisService } from 'src/database/redis.service';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { AuthResponseDto } from 'src/modules/auth/dto/auth-response.dto';
import { SignInDto } from 'src/modules/auth/dto/sign-in.dto';
import { ChangePasswordDto } from 'src/modules/auth/dto/change-password.dto';
import { ChangePasswordResponseDto } from 'src/modules/auth/dto/change-password-response.dto';
import { MailingService } from 'src/modules/mailing/mailing.service';
import { RoleEnum } from 'src/models/enums/role.enum';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly contestantService: ContestantService,
    private readonly mailingService: MailingService,
  ) {}

  private checkTokenExpiration(exp: number) {
    const currentTime: number = Math.floor(Date.now() / 1000);
    return currentTime > exp;
  }

  generateTokens(email: string, sub: string, role: RoleEnum) {
    return {
      accessToken: this.jwtService.sign({
        ...{ email, sub, role, jti: uuid() },
        expiresIn: '1h',
      }),
      refreshToken: this.jwtService.sign({
        ...{ email, sub, role, jti: uuid() },
        expiresIn: '1d',
      }),
    };
  }

  decodeToken(token: string): AuthPayload {
    return this.jwtService.decode(token);
  }

  validateToken(token: string) {
    console.log('🚀 ~ AuthService ~ validateToken ~ token:', token);
    const payload: AuthPayload = this.decodeToken(token);

    const isTokenExpired = this.checkTokenExpiration(payload.exp);
    if (isTokenExpired) {
      throw new BadRequestException('Invalid token');
    }

    return payload;
  }

  async signUp(signUpDto: SignUpDto) {
    console.log('🚀 ~ AuthService ~ signUp ~ signUpDto:', signUpDto);
    const result: Contestant = await this.contestantService.create(signUpDto);
    const contestant = { ...result };
    delete contestant.password;
    const { accessToken, refreshToken } = this.generateTokens(
      contestant.email,
      contestant.id,
      contestant.role,
    );
    return {
      contestant,
      jwt: accessToken,
      refreshToken,
    } as AuthResponseDto;
  }

  async signIn({ email, password }: SignInDto) {
    const contestant: Contestant =
      await this.contestantService.validateCredentials(email, password);
    const { accessToken, refreshToken } = this.generateTokens(
      contestant.email,
      contestant.id,
      contestant.role,
    );
    return {
      contestant,
      jwt: accessToken,
      refreshToken,
    } as AuthResponseDto;
  }

  async forgotPassword({ email }: ChangePasswordDto) {
    const contestant: Contestant = await this.contestantService.findOneBy({
      email,
    });
    if (!contestant) throw new NotFoundException('Contestant not found');

    const token: string = this.jwtService.sign(
      {
        sub: contestant.id,
        email: contestant.email,
      },
      { expiresIn: '5m' },
    );

    const resetUrl: string = `http://localhost:5173/reset-password?token=${token}`;

    const html: string = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #007bff;">Password Reset Request</h2>
        <p>Hello ${contestant.email},</p>
        <p>We received a request to reset your account password. Click the button below to reset it:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" 
            style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p>If the button above does not work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
          <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
        </p>
        <p><strong>Note:</strong> This link is valid for <strong>5 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
        <p>Best Regards,<br/>ITMC Club</p>
      </div>
    `;

    await this.mailingService.sendEmail(
      email,
      'Reset Password',
      resetUrl,
      html,
    );

    return {
      token,
      expiresIn: '5m',
    } as ChangePasswordResponseDto;
  }

  async resetPassword(token: string, newPassword: string) {
    const claim: AuthPayload = this.validateToken(token);
    const tokenBlackListed = await this.redisService.isTokenBlacklisted(token);
    if (tokenBlackListed) throw new BadGatewayException('Invalid token');

    const blackListTtl: number = claim.exp - Math.floor(Date.now() / 1000) + 10;
    await this.redisService.setTokenToBlackList(token, blackListTtl);

    const contestant = await this.contestantService.updatePassword(
      claim.sub,
      newPassword,
    );
    return contestant;
  }
}
