import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/contestant/entities/gender.enum';

export class FindContestantDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  schoolYear?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;
}
