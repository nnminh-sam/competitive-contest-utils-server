import { Contestant } from 'src/models/contestant.model';
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
    return await this.contestantService.findOne(payload.sub);
  }
}
