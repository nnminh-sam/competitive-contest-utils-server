import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contestant } from 'src/models/contestant.model';
import { Repository } from 'typeorm';
import { UpdateContestantDto } from 'src/modules/contestant/dto/update-contestant.dto';
import * as bcrypt from 'bcrypt';
import { FindContestantDto } from 'src/modules/contestant/dto/find-contestant.dto';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { AffiliationService } from 'src/modules/affiliation/affiliation.service';

@Injectable()
export class ContestantService {
  private readonly logger: Logger = new Logger(ContestantService.name);

  constructor(
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
    private readonly affiliationService: AffiliationService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Contestant> {
    const contestant: Contestant = await this.contestantRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        firstName: true,
        lastName: true,
        studentId: true,
        gender: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
      relations: ['affiliation'],
    });
    if (!contestant) {
      throw new NotFoundException('Contestant not found');
    }

    const isPasswordMatch: boolean = bcrypt.compareSync(
      password,
      contestant.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }

    const result: Contestant = { ...contestant, password: '' };
    return result;
  }

  async findOneBy(findContestantDto: FindContestantDto) {
    return await this.contestantRepository.findOne({
      where: { ...findContestantDto },
    });
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Contestant ID is required');
    }

    const contestant: Contestant = await this.contestantRepository.findOne({
      where: { id, availability: true },
      relations: ['team', 'affiliation', 'participations'],
    });
    if (!contestant) {
      throw new NotFoundException('Contestant not found');
    }

    return contestant;
  }

  async findTeamByContestantId(id: string) {
    if (!id) {
      throw new BadRequestException('Contestant ID is required');
    }

    const contestant: Contestant = await this.contestantRepository.findOne({
      where: { id },
      relations: ['team', 'team.members'],
    });
    if (!contestant) {
      throw new NotFoundException('Contestant not found');
    }

    if (!contestant.team) {
      throw new NotFoundException('Contestant does not have team');
    }

    return contestant;
  }

  async create(signUpDto: SignUpDto) {
    const isEmailTaken: boolean = await this.contestantRepository.existsBy({
      email: signUpDto.email,
    });
    if (isEmailTaken) {
      throw new BadRequestException('Email is taken');
    }

    const isUsernameTaken: boolean = await this.contestantRepository.existsBy({
      username: signUpDto.username,
    });
    if (isUsernameTaken) {
      throw new BadRequestException('Username is taken');
    }

    const isStudentIdTaken: boolean = await this.contestantRepository.existsBy({
      studentId: signUpDto.studentId,
    });
    if (isStudentIdTaken) {
      throw new BadRequestException('Student id is taken');
    }

    const affiliation = await this.affiliationService.findById(
      signUpDto.affiliationId,
    );
    if (!affiliation) {
      throw new BadRequestException('Affiliation not found');
    }

    try {
      const contestantEntity: Contestant = this.contestantRepository.create({
        ...signUpDto,
        affiliation,
        password: await bcrypt.hash(signUpDto.password, 10),
      });
      return await this.contestantRepository.save(contestantEntity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot create contestant');
    }
  }

  async update(id: string, updateContestantDto: UpdateContestantDto) {
    const isStudentIdTaken = await this.contestantRepository.findOneBy({
      studentId: updateContestantDto.studentId,
    });
    if (
      updateContestantDto?.studentId &&
      isStudentIdTaken &&
      isStudentIdTaken.id !== id
    )
      throw new BadRequestException('Student id is taken');

    const isEmailTaken = await this.contestantRepository.findOneBy({
      email: updateContestantDto.email,
    });
    if (updateContestantDto?.email && isEmailTaken && isEmailTaken.id !== id)
      throw new BadRequestException('Email is taken');

    const isUsernameTaken = await this.contestantRepository.findOneBy({
      username: updateContestantDto.username,
    });
    if (
      updateContestantDto?.username &&
      isUsernameTaken &&
      isUsernameTaken.id !== id
    )
      throw new BadRequestException('Username is taken');

    const affiliation = await this.affiliationService.findById(
      updateContestantDto.affiliationId,
    );
    if (!affiliation) {
      throw new BadRequestException('Affiliation not found');
    }

    const payload = {
      email: updateContestantDto.email,
      username: updateContestantDto.username,
      studentId: updateContestantDto.studentId,
      firstName: updateContestantDto.firstName,
      lastName: updateContestantDto.lastName,
      gender: updateContestantDto.gender,
      affiliation,
    };

    try {
      const res = await this.contestantRepository.update(
        { id, availability: true },
        payload,
      );
      if (!res?.affected) throw new NotFoundException('Contestant not found');

      return await this.contestantRepository.findOneBy({
        id,
        availability: true,
      });
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot update contestant');
    }
  }

  async updatePassword(id: string, password: string) {
    try {
      const contestant: Contestant = await this.contestantRepository.findOne({
        where: { id, availability: true },
      });
      if (!contestant) throw new NotFoundException('Contestant not found');

      const mergedEntity = this.contestantRepository.merge(contestant, {
        password: await bcrypt.hash(password, 10),
      });
      const result = await this.contestantRepository.save(mergedEntity);
      delete result.password;
      return result;
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot update password');
    }
  }
}
