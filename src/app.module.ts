import { Module } from '@nestjs/common';
import { ContestantModule } from './modules/contestant/contestant.module';
import { DatabaseModule } from './database/database.module';
import { EnvironmentModule } from './environment/environment.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TeamModule } from 'src/modules/team/team.module';
import { ContestModule } from 'src/modules/contest/contest.module';

@Module({
  imports: [
    ContestantModule,
    DatabaseModule,
    EnvironmentModule,
    AuthModule,
    TeamModule,
    ContestModule,
  ],
})
export class AppModule {}
