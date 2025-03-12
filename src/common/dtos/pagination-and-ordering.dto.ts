import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, Min } from 'class-validator';

export class PaginationAndOrderingDto {
  @ApiProperty({ description: 'Page', type: 'number', default: 1 })
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Number of item per page',
    type: 'number',
    default: 10,
  })
  @IsNumber()
  @Min(10)
  limit: number = 10;

  @ApiProperty({
    description: 'Order the return result by this field',
    type: 'string',
    default: 'id',
    name: 'order_by',
  })
  @IsString()
  orderBy: string = 'id';

  @ApiProperty({
    description: 'Sorting option: either asc or desc',
    type: 'string',
    default: 'asc',
    name: 'sort_by',
  })
  @IsString()
  sortBy: 'asc' | 'desc';
}
