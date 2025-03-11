import { JwtService } from '@nestjs/jwt';
import { JwtClaimDto } from './dto/jwt-claim.dto';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { ContestantService } from 'src/contestant/contestant.service';
import { Contestant } from 'src/contestant/entities/contestant.entity';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { RedisService } from 'src/database/redis.service';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly contestantService: ContestantService,
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
    console.log('🚀 ~ AuthService ~ validateToken ~ jwtClaimDto:', jwtClaimDto);
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
    return {
      token,
      expiresIn: '5m',
    };
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
