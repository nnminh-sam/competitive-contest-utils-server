import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contestant } from 'src/models/contestant.model';
import { Affiliation } from 'src/models/affiliation.model';
import { AdminInitService } from './admin-init.service';
import { EnvironmentModule } from 'src/environment/environment.module';
import { AffiliationModule } from 'src/modules/affiliation/affiliation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contestant, Affiliation]),
    EnvironmentModule,
    AffiliationModule,
  ],
  providers: [AdminInitService],
})
export class AdminModule {}
