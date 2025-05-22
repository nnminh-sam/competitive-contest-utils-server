import { ApiProperty } from '@nestjs/swagger';
import { ContestParticipation } from 'src/models/contest-participation.model';
import { Contestant } from 'src/models/contestant.model';
import { ContestType } from 'src/models/enums/contest-type.enum';
import { Team } from 'src/models/team.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Contest {
  @ApiProperty({
    description: 'Contest ID',
    type: 'string',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Contest name',
    type: 'string',
  })
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Contest formal name',
    type: 'string',
    name: 'formal_name',
    required: false,
  })
  @Column()
  formalName: string;

  @ApiProperty({
    description: 'Contest description',
    type: 'string',
    required: false,
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Contest banner URL',
    type: 'string',
  })
  @Column({ nullable: false })
  banner: string;

  @ApiProperty({
    description: 'Contest begin timestamp',
    type: 'string',
    name: 'start_at',
  })
  @Column({ nullable: false })
  startAt: Date;

  @ApiProperty({
    description: 'Contest duration in minutes',
    type: 'number',
    name: 'duration',
  })
  @Column({ nullable: false })
  duration: number;

  @ApiProperty({
    description: 'Contest type',
    type: 'string',
    default: ContestType.SINGLE,
  })
  @Column({ default: ContestType.SINGLE, enum: ContestType })
  type: ContestType;

  @ApiProperty({
    description: 'Contest participants',
    type: 'array',
  })
  @OneToMany(
    () => ContestParticipation,
    (contestParticipation) => contestParticipation.contest,
  )
  participants?: ContestParticipation[];

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
