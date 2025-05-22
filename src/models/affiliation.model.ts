import { ApiProperty } from '@nestjs/swagger';
import { Contestant } from 'src/models/contestant.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Affiliation {
  @ApiProperty({
    description: 'Affiliation unique identifier',
    type: 'string',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Affiliation name',
    type: 'string',
    required: true,
  })
  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => Contestant, (contestant) => contestant.affiliation, {
    cascade: true,
  })
  contestants: Contestant[];

  @ApiProperty({
    description: 'Create affiliation timestamp',
    type: 'string',
    name: 'created_at',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Update affiliation timestamp',
    type: 'string',
    name: 'updated_at',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
