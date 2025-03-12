import { PaginationAndOrderingDto } from './../../../common/dtos/pagination-and-ordering.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAffiliationDto extends PaginationAndOrderingDto {
  @ApiProperty({
    description: 'Affiliation name',
    type: 'string',
    required: true,
  })
  @IsString()
  name: string;
}
