import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'Contestant email', type: 'string' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Account password', type: 'string' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
