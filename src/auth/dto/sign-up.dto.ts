import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/contestant/entities/gender.enum';

export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    name: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'john_doe',
    name: 'username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password (should be at least 6 characters)',
    example: 'password123',
    name: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
    name: 'first_name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    name: 'last_name',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Student ID',
    example: '12345678',
    name: 'student_id',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'School year',
    example: '2024',
    name: 'school_year',
  })
  @IsString()
  @IsNotEmpty()
  schoolYear: string;

  @ApiProperty({
    description: 'Gender of the user',
    enum: Gender,
    example: Gender.MALE,
    name: 'gender',
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
