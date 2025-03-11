import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/models/enums/gender.enum';

export class UpdateContestantDto {
  @ApiPropertyOptional({
    description: 'First name of the contestant',
    name: 'first_name',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the contestant',
    name: 'last_name',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Student ID of the contestant',
    name: 'student_id',
  })
  @IsString()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'School year of the contestant',
    name: 'school_year',
  })
  @IsString()
  @IsOptional()
  schoolYear?: string;

  @ApiPropertyOptional({
    description: 'Gender of the contestant',
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
