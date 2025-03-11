import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ description: 'Team name', type: 'string' })
  @IsString()
  @IsOptional()
  name?: string;

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
