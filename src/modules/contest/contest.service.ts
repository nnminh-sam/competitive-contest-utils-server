import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Contest } from 'src/models/contest.model';
import { CreateContestDto } from 'src/modules/contest/dto/create-contest.dto';
import { UpdateContestDto } from 'src/modules/contest/dto/update-contest.dto';
import { FindContestDto } from 'src/modules/contest/dto/find-contest.dto';
import { Contestant } from 'src/models/contestant.model';
import { ContestantService } from 'src/modules/contestant/contestant.service';
import { TeamService } from 'src/modules/team/team.service';
import { Team } from 'src/models/team.model';

@Injectable()
export class ContestService {
  private readonly logger: Logger = new Logger(ContestService.name);

  constructor(
    @InjectRepository(Contest)
    private readonly contestRepository: Repository<Contest>,
    private readonly contestantService: ContestantService,
    private readonly teamService: TeamService,
  ) {}

  async create(createContestDto: CreateContestDto) {
    const isContestNameUsed = await this.contestRepository.existsBy({
      name: createContestDto.name,
    });

    if (isContestNameUsed) {
      throw new BadRequestException('Contest name has already been taken');
    }

    try {
      const contestEntity = this.contestRepository.create(createContestDto);
      return await this.contestRepository.save(contestEntity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot create contest');
    }
  }

  async findOne(id: string) {
    const contest = await this.contestRepository.findOneBy({ id });
    if (!contest) throw new BadRequestException('Contest not found');
    return contest;
  }

  async find(findContestDto: FindContestDto) {
    const { page, limit, orderBy, sortBy, name, startAt, duration, type } =
      findContestDto;

    return this.contestRepository.find({
      where: {
        ...(name ? { name: ILike(`%${name}%`) } : {}),
        ...(startAt ? { startAt } : {}),
        ...(duration ? { duration } : {}),
        ...(type ? { type } : {}),
      },
      skip: (page - 1) * limit,
      take: limit,
      order: orderBy ? { [orderBy]: sortBy } : undefined,
    });
  }

  async registerSingleContestant(contestId: string, contestantId: string) {
    const contest = await this.contestRepository.findOne({
      where: { id: contestId },
      relations: ['participants'],
    });
    if (!contest) throw new BadRequestException('Contest not found');
    if (contest.type !== 'Single')
      throw new BadRequestException('Invalid contestant');

    const contestant: Contestant =
      await this.contestantService.findOne(contestantId);
    if (!contestant) throw new BadRequestException('Contestant not found');
    if (contest.participants.some((c) => c.id === contestantId))
      throw new BadRequestException('Participated contestant');

    contest.participants.push(contestant);
    return await this.contestRepository.save(contest);
  }

  async registerTeamContestant(contestId: string, teamId: string) {
    const contest = await this.contestRepository.findOne({
      where: { id: contestId },
      relations: ['participants'],
    });
    if (!contest) throw new BadRequestException('Contest not found');
    if (contest.type !== 'Single')
      throw new BadRequestException('Invalid contestant');

    const team: Team = await this.teamService.findOne(teamId);
    if (!team) throw new BadRequestException('Team not found');
    if (contest.teamParticipants.some((c) => c.id === teamId))
      throw new BadRequestException('Participated team');

    contest.teamParticipants.push(team);
    return await this.contestRepository.save(contest);
  }

  async update(id: string, updateContestDto: UpdateContestDto) {
    const contest = await this.contestRepository.findOneBy({ id });

    if (!contest) {
      throw new BadRequestException('Contest not found');
    }

    try {
      const mergedEntity = this.contestRepository.merge(
        contest,
        updateContestDto,
      );
      return await this.contestRepository.save(mergedEntity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot update contest');
    }
  }
}
