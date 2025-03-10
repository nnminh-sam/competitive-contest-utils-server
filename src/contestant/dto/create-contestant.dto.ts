import { IsEmail, IsEnum, IsNotEmpty, IsString, Min } from 'class-validator';
import { Gender } from 'src/contestant/entities/gender.enum';

export class CreateContestantDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Min(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
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
