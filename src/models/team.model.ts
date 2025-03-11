import { Contestant } from 'src/models/contestant.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Contestant, (contestant) => contestant.team, {
    cascade: true,
  })
  members: Contestant[];
}
