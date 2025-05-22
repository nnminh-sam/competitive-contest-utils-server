import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contestant } from 'src/models/contestant.model';
import { Affiliation } from 'src/models/affiliation.model';
import { RoleEnum } from 'src/models/enums/role.enum';
import { Gender } from 'src/models/enums/gender.enum';
import { EnvironmentService } from 'src/environment/environment.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminInitService implements OnModuleInit {
  constructor(
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
    @InjectRepository(Affiliation)
    private readonly affiliationRepository: Repository<Affiliation>,
    private readonly environmentService: EnvironmentService,
  ) {}

  async onModuleInit() {
    await this.initializeAdmin();
  }

  private async initializeAdmin() {
    // Find all admin contestants
    const adminContestants = await this.contestantRepository.find({
      where: { role: RoleEnum.ADMIN },
    });

    // If there are any admin contestants, remove them
    if (adminContestants.length > 0) {
      await this.contestantRepository.remove(adminContestants);
    }

    // Find or create admin affiliation
    let adminAffiliation = await this.affiliationRepository.findOne({
      where: { name: 'admin' },
    });

    if (!adminAffiliation) {
      adminAffiliation = this.affiliationRepository.create({
        name: 'admin',
      });
      await this.affiliationRepository.save(adminAffiliation);
    }

    // Create new admin contestant
    const hashedPassword = await bcrypt.hash(
      this.environmentService.adminPassword,
      10,
    );

    const adminContestant = this.contestantRepository.create({
      email: this.environmentService.adminEmail,
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      studentId: 'ADMIN001',
      role: RoleEnum.ADMIN,
      gender: Gender.OTHER,
      affiliation: adminAffiliation,
    });

    await this.contestantRepository.save(adminContestant);
  }
}
