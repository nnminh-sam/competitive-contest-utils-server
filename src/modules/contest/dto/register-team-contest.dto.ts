import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterTeamContestDto {
  @ApiProperty({
    description: 'Unique identifier of the registrating team',
    type: 'string',
    name: 'team_id',
  })
  @IsString()
  @IsNotEmpty()
  teamId: string;
}
