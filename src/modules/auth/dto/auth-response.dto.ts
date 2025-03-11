import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Contestant } from 'src/models/contestant.entity';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Contestant object',
    type: Contestant,
    name: 'contestant',
  })
  contestant: Contestant;

  @ApiPropertyOptional({
    description: 'Access token using JWT token',
    type: 'string',
    name: 'access_token',
  })
  accessToken?: string;

  @ApiPropertyOptional({
    description:
      'Refresh token using JWT token for revoking access token (or jwt token)',
    type: 'string',
    name: 'refresh_token',
  })
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'JWT token using JWT token (the same with access token)',
    type: 'string',
    name: 'jwt',
  })
  jwt?: string;
}
