import { IsEmail, IsEnum, IsNotEmpty, IsString, Min } from 'class-validator';
import { Gender } from 'src/contestant/entities/gender.enum';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  schoolYear: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
