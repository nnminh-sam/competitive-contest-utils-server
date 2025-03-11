import { Module } from '@nestjs/common';
import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from 'src/models/contest.model';

@Module({
  imports: [TypeOrmModule.forFeature([Contest])],
  providers: [ContestService],
  controllers: [ContestController],
})
export class ContestModule {}
