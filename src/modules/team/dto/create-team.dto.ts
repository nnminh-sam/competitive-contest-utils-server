import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ description: 'Team name', type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Team description',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of team member emails',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true, message: 'Invalid email format' })
  members: string[];
}
