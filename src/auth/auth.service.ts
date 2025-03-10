import { JwtService } from '@nestjs/jwt';
import { JwtClaimDto } from './dto/jwt-claim.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { ContestantService } from 'src/contestant/contestant.service';
import { Contestant } from 'src/contestant/entities/contestant.entity';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
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
    if (!jwtClaimDto?.exp) throw new BadRequestException('Invalid token');

    const tokenExpired = this.isTokenExpired(jwtClaimDto.exp);
    if (tokenExpired) throw new BadRequestException('Invalid token');

    return true;
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
}
