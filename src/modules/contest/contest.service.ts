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
import { ContestType } from 'src/models/enums/contest-type.enum';

@Injectable()
export class ContestService {
  private readonly logger: Logger = new Logger(ContestService.name);

  constructor(
    @InjectRepository(Contest)
    private readonly contestRepository: Repository<Contest>,
    private readonly contestantService: ContestantService,
    private readonly teamService: TeamService,
  ) {}

  async checkUniqueContestName(name: string) {
    if (!name) throw new BadRequestException('Contest name is required');
    const isNameTaken = await this.contestRepository.existsBy({ name });
    if (isNameTaken) throw new BadRequestException('Name is taken');
  }

  async findOne(id: string) {
    if (!id) return null;
    return await this.contestRepository.findOne({
      where: { id },
      relations: ['participants', 'teamParticipants'],
    });
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
      relations: ['participants', 'teamParticipants'],
    });
  }

  async create(createContestDto: CreateContestDto) {
    await this.checkUniqueContestName(createContestDto.name);

    try {
      const contestEntity = this.contestRepository.create(createContestDto);
      return await this.contestRepository.save(contestEntity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot create contest');
    }
  }

  async registerSingleContestant(contestId: string, contestantId: string) {
    if (!contestId || !contestantId)
      throw new BadRequestException('Invalid contest id or contestant id');

    const contest = await this.findOne(contestId);
    if (!contest) throw new BadRequestException('Contest not found');
    if (contest.type !== ContestType.SINGLE)
      throw new BadRequestException(
        'Invalid contest type! Contest must be type Single',
      );

    const contestant: Contestant =
      await this.contestantService.findOne(contestantId);
    if (!contestant) throw new BadRequestException('Contestant not found');
    if (
      contest.participants.some(
        (participant) => participant.id === contestantId,
      )
    )
      throw new BadRequestException('Contestant is already participated');

    contest.participants.push(contestant);
    return await this.contestRepository.save(contest);
  }

  async registerTeamContestant(contestId: string, teamId: string) {
    if (!contestId || !teamId)
      throw new BadRequestException('Invalid contest id or team id');

    const contest = await this.findOne(contestId);
    if (!contest) throw new BadRequestException('Contest not found');
    if (contest.type !== ContestType.TEAM)
      throw new BadRequestException(
        'Invalid contest type! Contest must be type Team',
      );

    const team: Team = await this.teamService.findOne(teamId);
    if (!team) throw new BadRequestException('Team not found');
    if (contest.teamParticipants.some((team) => team.id === teamId))
      throw new BadRequestException('Team is already participated');

    contest.teamParticipants.push(team);
    return await this.contestRepository.save(contest);
  }

  async update(id: string, updateContestDto: UpdateContestDto) {
    if (!id) throw new BadRequestException('Invalid contest id');
    await this.checkUniqueContestName(updateContestDto?.name);

    const contest = await this.contestRepository.findOneBy({ id });
    if (!contest) throw new BadRequestException('Contest not found');

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
