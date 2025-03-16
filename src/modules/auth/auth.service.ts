import { JwtService } from '@nestjs/jwt';
import { JwtClaimDto } from './dto/jwt-claim.dto';
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

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly contestantService: ContestantService,
    private readonly mailingService: MailingService,
  ) {}

  private isTokenExpired(exp: number) {
    const currentTime: number = Math.floor(Date.now() / 1000);
    return currentTime > exp;
  }

  generateTokens(jwtClaimDto: JwtClaimDto) {
    return {
      accessToken: this.jwtService.sign({ ...jwtClaimDto, expiresIn: '1h' }),
      refreshToken: this.jwtService.sign({ ...jwtClaimDto, expiresIn: '1d' }),
    };
  }

  extractClaim(token: string) {
    return this.jwtService.decode(token) as JwtClaimDto;
  }

  validateToken(token: string) {
    const jwtClaimDto: JwtClaimDto = this.extractClaim(token);
    if (!jwtClaimDto?.exp) throw new BadRequestException('Invalid token');

    const tokenExpired = this.isTokenExpired(jwtClaimDto.exp);
    if (tokenExpired) throw new BadRequestException('Invalid token');

    return jwtClaimDto;
  }

  async signUp(signUpDto: SignUpDto) {
    const contestant: Contestant =
      await this.contestantService.create(signUpDto);
    const { accessToken, refreshToken } = this.generateTokens({
      email: contestant.email,
      sub: contestant.id,
    });
    return {
      contestant,
      jwt: accessToken,
      refreshToken,
    } as AuthResponseDto;
  }

  async signIn({ email, password }: SignInDto) {
    const contestant: Contestant =
      await this.contestantService.findOneByCredentials(email, password);
    const { accessToken, refreshToken } = this.generateTokens({
      email: contestant.email,
      sub: contestant.id,
    });
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
    const claim: JwtClaimDto = this.validateToken(token);
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
