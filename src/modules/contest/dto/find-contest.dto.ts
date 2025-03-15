import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationAndOrderingDto } from './../../../common/dtos/pagination-and-ordering.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ContestType } from 'src/models/enums/contest-type.enum';
export class FindContestDto extends PaginationAndOrderingDto {
  @ApiProperty({
    description: 'Contest name',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Contest begin date',
    type: 'string',
    required: false,
  })
  @IsDate()
  @IsOptional()
  startAt?: Date;

  @ApiProperty({
    description: 'Contest duration',
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'Contest type',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: ContestType;
}
