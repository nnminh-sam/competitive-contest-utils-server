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
import { Contest } from 'src/models/contest.model';

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
    if (!contestant) throw new BadRequestException('Contestant not found');

    const matchedPassword: boolean = bcrypt.compareSync(
      password,
      contestant.password,
    );
    if (!matchedPassword) throw new BadRequestException('Invalid password');

    delete contestant.password;
    return contestant;
  }

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

  async findAllParticipatedContests(id: string) {
    if (!id) throw new BadRequestException('Invalid contestant id');
    const contestant: Contestant = await this.contestantRepository.findOne({
      where: { id },
      relations: ['contests', 'team', 'team.contests'],
    });
    const result: Contest[] = [];
    contestant?.contests.forEach((contest) => {
      result.push(contest);
    });
    const team: Team = contestant?.team;
    if (team) {
      team?.contests.forEach((contest) => {
        result.push(contest);
      });
    }
    return result;
  }

  async create(signUpDto: SignUpDto) {
    const isEmailTaken: boolean = await this.contestantRepository.existsBy({
      email: signUpDto.email,
    });
    if (isEmailTaken) throw new BadRequestException('Email is taken');

    const isUsernameTaken: boolean = await this.contestantRepository.existsBy({
      username: signUpDto.username,
    });
    if (isUsernameTaken) throw new BadRequestException('Username is taken');

    const isStudentIdTaken: boolean = await this.contestantRepository.existsBy({
      studentId: signUpDto.studentId,
    });
    if (isStudentIdTaken) throw new BadRequestException('Student id is taken');

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
