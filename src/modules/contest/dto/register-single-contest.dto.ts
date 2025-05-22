import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RegisterSingleContestDto {
  @ApiProperty({
    description: 'Unique identifier of the participating contest',
    type: 'string',
    name: 'contest_id',
  })
  @IsNotEmpty()
  @IsUUID()
  contestId: string;
}
