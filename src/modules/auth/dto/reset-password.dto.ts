import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset password token',
    type: 'string',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Contestant new password',
    type: 'string',
  })
  @IsString()
  newPassword: string;
}
