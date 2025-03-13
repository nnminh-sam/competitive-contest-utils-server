import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterSingleContestDto {
  @ApiProperty({
    description: 'Unique identifier of the registrating contestant',
    type: 'string',
    name: 'contestant_id',
  })
  @IsString()
  @IsNotEmpty()
  contestantId: string;
}
