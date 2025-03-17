import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/models/enums/gender.enum';

export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    name: 'email',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'john_doe',
    name: 'username',
  })
  @IsNotEmpty()
  @IsString({ message: 'Invalid username' })
  username: string;

  @ApiProperty({
    description: 'User password (should be at least 6 characters)',
    example: 'password123',
    name: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
    name: 'first_name',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    name: 'last_name',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Student ID',
    example: '12345678',
    name: 'student_id',
  })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'School year',
    example: '2024',
    name: 'school_year',
  })
  @IsOptional()
  @IsString()
  schoolYear?: string;

  @ApiProperty({
    description: 'Gender of the user',
    enum: Gender,
    example: Gender.MALE,
    name: 'gender',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
