import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/models/enums/gender.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @ApiProperty({ description: 'Contestant school year', name: 'school_year' })
  @Column({ nullable: false })
  schoolYear: string;

  @ApiProperty({ description: 'Contestant gender', name: 'gender' })
  @Column({ enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @ApiProperty({ description: 'Contestant availability', name: 'availability' })
  @Column({ default: true, select: false })
  availability: boolean;

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
