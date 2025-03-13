import { ApiProperty } from '@nestjs/swagger';
import { Contestant } from 'src/models/contestant.model';
import { Team } from 'src/models/team.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Contest {
  @ApiProperty({
    description: 'Contest unique identifier',
    type: 'string',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: "Contest's name",
    type: 'string',
    required: true,
  })
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({
    description: "Contest's formal name",
    type: 'string',
    name: 'formal_name',
  })
  @Column({ default: null })
  formalName: string;

  @ApiProperty({
    description: "Contest's description",
    type: 'string',
  })
  @Column({ default: null })
  description: string;

  @ApiProperty({
    description: "Contest's banner URL",
    type: 'string',
    required: false,
  })
  @Column({ default: null })
  banner: string;

  @ApiProperty({
    description: "Contest's begin timestamp",
    type: 'string',
    name: 'start_at',
  })
  @Column({ nullable: false })
  startAt: Date;

  @ApiProperty({
    description: "Contest's duration in minutes",
    type: 'number',
    name: 'duration',
  })
  @Column({ nullable: false })
  duration: number;

  @ApiProperty({
    description: "Contest's type",
    type: 'string',
  })
  @Column({ default: 'Single' })
  type: 'Team' | 'Single';

  @ManyToMany(() => Contestant, (contestant) => contestant.contests, {
    nullable: true,
  })
  @JoinTable()
  participants?: Contestant[];

  @ManyToMany(() => Team, (team) => team.contests, { nullable: true })
  @JoinTable()
  teamParticipants?: Team[];

  @ApiProperty({
    description: 'Create contest timestamp',
    type: 'string',
    name: 'created_at',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Update contest timestamp',
    type: 'string',
    name: 'updated_at',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
