import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsEnum,
} from 'class-validator';
import { ContestType } from 'src/models/enums/contest-type.enum';

export class CreateContestDto {
  @ApiProperty({ description: "Contest's name", type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Contest's formal name",
    type: 'string',
    required: false,
    name: 'formal_name',
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
  })
  @IsString()
  banner: string;

  @ApiProperty({
    description: "Contest's start timestamp",
    type: 'string',
    format: 'date-time',
    name: 'start_at',
  })
  @IsDateString()
  @IsNotEmpty()
  startAt: Date;

  @ApiProperty({ description: "Contest's duration in minutes", type: 'number' })
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: "Contest's type",
    type: 'string',
    default: ContestType.SINGLE,
  })
  @IsEnum(ContestType)
  type?: ContestType;
}
