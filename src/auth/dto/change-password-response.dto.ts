import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponseDto {
  @ApiProperty({
    description: 'Token for calling reset password API',
    type: 'string',
  })
  token: string;

  @ApiProperty({
    description: 'Expire time of the token',
    type: 'string',
    name: 'expires_in',
  })
  expiresIn: string;
}
