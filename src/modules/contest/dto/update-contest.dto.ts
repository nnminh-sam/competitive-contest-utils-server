import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateContestDto } from './create-contest.dto';

export class UpdateContestDto extends PartialType(CreateContestDto) {
  @ApiProperty({ description: 'Contest ID', type: 'string' })
  id: string;
}
