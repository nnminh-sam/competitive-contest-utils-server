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
import { camelCaseToNormal } from 'src/helpers';
import * as bcrypt from 'bcrypt';
import { FindContestantDto } from 'src/modules/contestant/dto/find-contestant.dto';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { Team } from 'src/models/team.model';

@Injectable()
export class ContestantService {
  private readonly logger: Logger = new Logger(ContestantService.name);

  constructor(
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
  ) {}

  async findOneByCredentials(email: string, password: string) {
    const contestant: Contestant = await this.contestantRepository
      .createQueryBuilder('contestants')
      .where('contestants.email = :email', { email })
      .addSelect('contestants.password')
      .getOne();
    if (!contestant) throw new BadRequestException('Invalid email');

    const matchedPassword: boolean = bcrypt.compareSync(
      password,
      contestant.password,
    );
    if (!matchedPassword) throw new BadRequestException('Invalid password');

    delete contestant.password;
    return contestant;
  }

  // TODO: rework on this
  async findOneBy(findContestantDto: FindContestantDto) {
    return await this.contestantRepository.findOne({
      where: { ...findContestantDto },
    });
  }

  async findOne(id: string) {
    if (!id) return null;

    return await this.contestantRepository.findOne({
      where: { id, availability: true },
    });
  }

  async findJoinedTeam(id: string) {
    if (!id) throw new BadRequestException('Invalid contestant id');
    const contestant: Contestant = await this.contestantRepository.findOne({
      where: { id },
      relations: ['team', 'team.members'],
    });
    return contestant?.team;
  }

  async findParticipatedContests(id: string) {
    if (!id) throw new BadRequestException('Invalid contestant id');
    const contestant: Contestant = await this.contestantRepository.findOne({
      where: { id },
      relations: ['contests'],
    });
    return contestant?.contests;
  }

  async create(signUpDto: SignUpDto) {
    const validatingFields: string[] = ['email', 'username', 'studentId'];
    const validationResults: boolean[] = await Promise.all(
      validatingFields.map((value: string) => {
        return this.contestantRepository.existsBy({ [value]: value });
      }),
    );
    const invalidResult = validationResults.includes(true);
    if (invalidResult) {
      const exceptionMessage: string = validationResults
        .map((value: boolean, index: number) => {
          return value ? '' : camelCaseToNormal(validatingFields.at(index));
        })
        .join(', ');
      throw new BadRequestException(`${exceptionMessage} is taken`);
    }

    try {
      const contestantEntity: Contestant = this.contestantRepository.create({
        ...signUpDto,
        password: await bcrypt.hash(signUpDto.password, 10),
      });
      return await this.contestantRepository.save(contestantEntity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot create contestant');
    }
  }

  async update(id: string, updateContestantDto: UpdateContestantDto) {
    try {
      const res = await this.contestantRepository.update(
        { id, availability: true },
        { ...updateContestantDto },
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
