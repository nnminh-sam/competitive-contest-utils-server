import { Module } from '@nestjs/common';
import { ContestantService } from './contestant.service';
import { ContestantController } from './contestant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contestant } from 'src/models/contestant.model';

@Module({
  imports: [TypeOrmModule.forFeature([Contestant])],
  providers: [ContestantService],
  controllers: [ContestantController],
  exports: [ContestantService],
})
export class ContestantModule {}
