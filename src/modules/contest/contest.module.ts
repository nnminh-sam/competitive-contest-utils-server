import { Module } from '@nestjs/common';
import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from 'src/models/contest.model';
import { ContestantModule } from 'src/modules/contestant/contestant.module';
import { TeamModule } from 'src/modules/team/team.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contest]), ContestantModule, TeamModule],
  providers: [ContestService],
  controllers: [ContestController],
})
export class ContestModule {}
