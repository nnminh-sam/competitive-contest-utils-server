import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/models/enums/gender.enum';

export class UpdateContestantDto {
  @ApiPropertyOptional({
    description: 'Email of the contestant',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Username of the contestant',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'First name of the contestant',
    name: 'first_name',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the contestant',
    name: 'last_name',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Student ID of the contestant',
    name: 'student_id',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'School year of the contestant',
    name: 'school_year',
  })
  @IsOptional()
  @IsString()
  schoolYear?: string;

  @ApiPropertyOptional({
    description: 'Gender of the contestant',
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
