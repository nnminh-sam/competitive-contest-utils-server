import { ApiProperty } from '@nestjs/swagger';
import { Contestant } from 'src/models/contestant.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Team {
  @ApiProperty({ description: 'Team unique identifier', type: 'string' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Team name', type: 'string' })
  @Column({ nullable: false, unique: true })
  name: string;

  @ApiProperty({
    description: 'Team description',
    type: 'string',
    required: false,
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Team members',
    type: () => Contestant,
    isArray: true,
  })
  @OneToMany(() => Contestant, (contestant) => contestant.team, {
    cascade: true,
  })
  members: Contestant[];

  @ApiProperty({
    description: 'Create team timestamp',
    type: 'string',
    name: 'created_at',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Update team timestamp',
    type: 'string',
    name: 'updated_at',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
