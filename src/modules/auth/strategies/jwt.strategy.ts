import { Contestant } from 'src/models/contestant.entity';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ContestantService } from 'src/modules/contestant/contestant.service';
import { EnvironmentService } from 'src/environment/environment.service';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtClaimDto } from 'src/modules/auth/dto/jwt-claim.dto';
import { AuthResponseDto } from 'src/modules/auth/dto/auth-response.dto';

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
