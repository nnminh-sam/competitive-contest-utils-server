import { Contest } from 'src/models/contest.model';
import { Contestant } from 'src/models/contestant.model';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity('contest_participations')
export class ContestParticipation {
  @PrimaryColumn()
  contestId: string;

  @PrimaryColumn()
  contestantId: string;

  @ManyToOne(() => Contest, { nullable: false, onDelete: 'CASCADE' })
  contest: Contest;

  @ManyToOne(() => Contestant, { nullable: false, onDelete: 'CASCADE' })
  contestant: Contestant;

  @CreateDateColumn()
  createdAt: Date;
}
