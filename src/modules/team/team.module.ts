import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/models/team.model';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
})
export class TeamModule {}
