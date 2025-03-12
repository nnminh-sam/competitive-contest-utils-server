import { PaginationAndOrderingDto } from './../../../common/dtos/pagination-and-ordering.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAffiliationDto extends PaginationAndOrderingDto {
  @ApiProperty({
    description: 'Affiliation name',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  name: string;
}
