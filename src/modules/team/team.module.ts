import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/models/team.model';
import { ContestantModule } from 'src/modules/contestant/contestant.module';
import { TeamController } from 'src/modules/team/team.controller';
import { TeamService } from 'src/modules/team/team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), ContestantModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
