import { Module } from '@nestjs/common';
import { ContestantModule } from './contestant/contestant.module';
import { DatabaseModule } from './database/database.module';
import { EnvironmentModule } from './environment/environment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ContestantModule, DatabaseModule, EnvironmentModule, AuthModule],
})
export class AppModule {}
