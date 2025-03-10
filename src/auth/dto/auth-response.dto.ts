import { Contestant } from 'src/contestant/entities/contestant.entity';

export class AuthResponseDto {
  contestant: Contestant;

  accessToken?: string;

  refreshToken?: string;

  jwt?: string;
}
