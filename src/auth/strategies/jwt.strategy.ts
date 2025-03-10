import { Contestant } from 'src/contestant/entities/contestant.entity';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtClaimDto } from 'src/auth/dto/jwt-claim.dto';
import { ContestantService } from 'src/contestant/contestant.service';
import { EnvironmentService } from 'src/environment/environment.service';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly contestantService: ContestantService,
    private readonly environmentService: EnvironmentService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environmentService.secret,
    });
  }

  async validate(payload: JwtClaimDto) {
    const contestant: Contestant = await this.contestantService.findOne(
      payload.sub,
    );
    const { accessToken, refreshToken } = this.authService.generateTokens({
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
