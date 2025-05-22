import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Gender } from 'src/models/enums/gender.enum';

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

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsUUID()
  @IsNotEmpty()
  affiliationId: string;
}
