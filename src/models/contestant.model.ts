import { ApiProperty } from '@nestjs/swagger';
import { Affiliation } from 'src/models/affiliation.model';
import { ContestParticipation } from 'src/models/contest-participation.model';
import { Contest } from 'src/models/contest.model';
import { Gender } from 'src/models/enums/gender.enum';
import { RoleEnum } from 'src/models/enums/role.enum';
import { Team } from 'src/models/team.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'contestants' })
export class Contestant {
  @ApiProperty({ description: 'Contestant unique identifier', name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Contestant email', name: 'email' })
  @Column({ nullable: false, unique: true, update: false })
  email: string;

  @ApiProperty({ description: 'Contestant username', name: 'username' })
  @Column({ nullable: false, unique: true })
  username: string;

  @ApiProperty({ description: 'Contestant account password' })
  @Column({ nullable: false, select: false })
  password: string;

  @ApiProperty({ description: 'Contestant first name', name: 'first_name' })
  @Column({ nullable: false })
  firstName: string;

  @ApiProperty({ description: 'Contestant last name', name: 'last_name' })
  @Column({ nullable: false })
  lastName: string;

  @ApiProperty({ description: 'Contestant student ID', name: 'student_id' })
  @Column({ nullable: false, unique: true })
  studentId: string;

  @ApiProperty({
    description: 'Contestant affiliation ID',
    name: 'affiliation_id',
  })
  @ManyToOne(() => Affiliation, (affiliation) => affiliation.contestants, {
    nullable: false,
  })
  affiliation: Affiliation;

  @ApiProperty({ description: 'Contestant gender', name: 'gender' })
  @Column({ enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @ApiProperty({
    description: 'Joined team',
    name: 'team',
    type: Team,
    required: false,
  })
  @ManyToOne(() => Team, (team) => team.members, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  team?: Team;

  @ApiProperty({
    description: 'Contest participations',
    name: 'participations',
    type: [ContestParticipation],
    required: false,
    readOnly: true,
  })
  @OneToMany(
    () => ContestParticipation,
    (contestParticipation) => contestParticipation.contestant,
  )
  participations?: ContestParticipation[];

  @ApiProperty({ description: 'Contestant availability', name: 'availability' })
  @Column({ default: true, select: false })
  availability: boolean;

  @Column({
    enum: RoleEnum,
    default: RoleEnum.CONTESTANT,
    nullable: true,
  })
  role: RoleEnum;

  @ApiProperty({
    description: 'Create contestant timestamp',
    name: 'created_at',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Update contestant timestamp',
    name: 'updated_at',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
