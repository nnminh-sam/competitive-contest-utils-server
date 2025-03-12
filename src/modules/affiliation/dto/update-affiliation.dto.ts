import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAffiliationDto {
  @ApiProperty({ description: 'Affiliation name', type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
