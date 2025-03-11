import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateContestDto {
  @ApiProperty({ description: "Contest's name", type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Contest's formal name",
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  formalName?: string;

  @ApiProperty({
    description: "Contest's description",
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Contest's banner URL",
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  banner?: string;

  @ApiProperty({
    description: "Contest's start timestamp",
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  startAt: Date;

  @ApiProperty({ description: "Contest's duration in minutes", type: 'number' })
  @IsInt()
  @IsNotEmpty()
  duration: number;
}
