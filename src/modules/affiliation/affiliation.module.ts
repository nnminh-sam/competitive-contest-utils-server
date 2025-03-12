import { Module } from '@nestjs/common';
import { AffiliationService } from './affiliation.service';
import { AffiliationController } from './affiliation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affiliation } from 'src/models/affiliation.model';

@Module({
  imports: [TypeOrmModule.forFeature([Affiliation])],
  providers: [AffiliationService],
  controllers: [AffiliationController],
  exports: [AffiliationService],
})
export class AffiliationModule {}
