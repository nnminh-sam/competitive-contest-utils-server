import { Module } from '@nestjs/common';
import { ContestantModule } from './modules/contestant/contestant.module';
import { DatabaseModule } from './database/database.module';
import { EnvironmentModule } from './environment/environment.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TeamModule } from 'src/modules/team/team.module';

@Module({
  imports: [
    ContestantModule,
    DatabaseModule,
    EnvironmentModule,
    AuthModule,
    TeamModule,
  ],
})
export class AppModule {}
