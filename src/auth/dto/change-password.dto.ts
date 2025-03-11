import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Email of the changing password',
    type: 'string',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
