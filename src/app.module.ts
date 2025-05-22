import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { ContestantModule } from './modules/contestant/contestant.module';
import { DatabaseModule } from './database/database.module';
import { EnvironmentModule } from './environment/environment.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TeamModule } from 'src/modules/team/team.module';
import { ContestModule } from 'src/modules/contest/contest.module';
import { AffiliationModule } from './modules/affiliation/affiliation.module';
import { MailingModule } from './modules/mailing/mailing.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ContestantModule,
    DatabaseModule,
    EnvironmentModule,
    AuthModule,
    TeamModule,
    ContestModule,
    AffiliationModule,
    MailingModule,
    AdminModule,
  ],
})
export class AppModule {}
