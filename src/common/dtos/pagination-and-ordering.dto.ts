import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationAndOrderingDto {
  @ApiProperty({ description: 'Page', type: 'number', default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value !== null ? Number(value) : 1))
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    type: 'number',
    default: 10,
  })
  @IsNumber()
  @Min(10)
  @IsOptional()
  @Transform(({ value }) => (value !== null ? Number(value) : 10))
  limit: number = 10;

  @ApiProperty({
    description: 'Order the return result by this field',
    type: 'string',
    default: 'id',
    name: 'order_by',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value !== null ? value : 'id'))
  orderBy: string = 'id';

  @ApiProperty({
    description: 'Sorting option: either asc or desc',
    type: 'string',
    default: 'asc',
    name: 'sort_by',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value !== null ? value : 'asc'))
  sortBy: 'asc' | 'desc' = 'asc';
}
