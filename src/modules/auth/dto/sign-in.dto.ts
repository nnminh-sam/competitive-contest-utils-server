import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'Contestant email', type: 'string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({ description: 'Account password', type: 'string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Invalid password' })
  password: string;
}
