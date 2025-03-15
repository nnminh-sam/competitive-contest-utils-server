import { ApiProperty } from '@nestjs/swagger';
import { Contestant } from 'src/models/contestant.model';
import { ContestType } from 'src/models/enums/contest-type.enum';
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
    readOnly: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: "Contest's name",
    type: 'string',
  })
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({
    description: "Contest's formal name",
    type: 'string',
    name: 'formal_name',
    required: false,
  })
  @Column()
  formalName: string;

  @ApiProperty({
    description: "Contest's description",
    type: 'string',
    required: false,
  })
  @Column()
  description: string;

  @ApiProperty({
    description: "Contest's banner URL",
    type: 'string',
  })
  @Column({ nullable: false })
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
    default: ContestType.SINGLE,
  })
  @Column({ default: ContestType.SINGLE, enum: ContestType })
  type: ContestType;

  @ApiProperty({
    description: 'Contest participants (for Single type contest)',
    type: 'array',
    readOnly: true,
  })
  @ManyToMany(() => Contestant, (contestant) => contestant.contests, {
    nullable: true,
  })
  @JoinTable()
  participants?: Contestant[];

  @ApiProperty({
    description: 'Contest participated teams (for Team type contest)',
    type: 'array',
    readOnly: true,
  })
  @ManyToMany(() => Team, (team) => team.contests, { nullable: true })
  @JoinTable()
  teamParticipants?: Team[];

  @ApiProperty({
    description: 'Create contest timestamp',
    type: 'string',
    format: 'date-time',
    name: 'created_at',
    readOnly: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Update contest timestamp',
    type: 'string',
    format: 'date-time',
    name: 'updated_at',
    readOnly: true,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
