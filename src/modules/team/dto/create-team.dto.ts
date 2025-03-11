import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
    description: 'List of team member usernames',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  members: string[];
}
