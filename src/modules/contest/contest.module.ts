import { Module } from '@nestjs/common';
import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from 'src/models/contest.model';
import { ContestantModule } from 'src/modules/contestant/contestant.module';
import { TeamModule } from 'src/modules/team/team.module';
import { ContestParticipation } from 'src/models/contest-participation.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contest, ContestParticipation]),
    ContestantModule,
    TeamModule,
  ],
  providers: [ContestService],
  controllers: [ContestController],
})
export class ContestModule {}
