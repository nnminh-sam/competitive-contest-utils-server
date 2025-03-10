import { IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { Gender } from 'src/contestant/entities/gender.enum';

export class UpdateContestantDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  schoolYear?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
