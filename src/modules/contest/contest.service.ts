import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Contest } from 'src/models/contest.model';
import { CreateContestDto } from 'src/modules/contest/dto/create-contest.dto';
import { UpdateContestDto } from 'src/modules/contest/dto/update-contest.dto';
import { FindContestDto } from 'src/modules/contest/dto/find-contest.dto';
import { Contestant } from 'src/models/contestant.model';
import { ContestantService } from 'src/modules/contestant/contestant.service';
import { TeamService } from 'src/modules/team/team.service';
import { ContestType } from 'src/models/enums/contest-type.enum';
import { ContestParticipation } from 'src/models/contest-participation.model';

@Injectable()
export class ContestService {
  private readonly logger: Logger = new Logger(ContestService.name);

  constructor(
    @InjectRepository(Contest)
    private readonly contestRepository: Repository<Contest>,
    @InjectRepository(ContestParticipation)
    private readonly contestParticipationRepository: Repository<ContestParticipation>,
    private readonly contestantService: ContestantService,
    private readonly teamService: TeamService,
  ) {}

  /**
   * Check if a contestant is participated in a a contest or not.
   * @param contestant
   * @param contest
   * @returns true if contestant is participated, otherwise returns false
   */
  private checkParticipatedContest(contestant: Contestant, contest: Contest) {
    const participations: ContestParticipation[] = contestant?.participations;
    if (!participations) {
      return false;
    }
    const result = participations.findIndex((p) => p.contestId === contest.id);
    return result !== -1;
  }

  async checkUniqueContestName(name: string) {
    if (!name) {
      throw new BadRequestException('Contest name is required');
    }

    const isNameTaken = await this.contestRepository.existsBy({ name });
    if (isNameTaken) {
      throw new BadRequestException('Contest name has been taken');
    }
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }

    const contest = await this.contestRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    return contest;
  }

  async find(findContestDto: FindContestDto) {
    const { page, limit, orderBy, sortBy, name, ...filters } = findContestDto;

    return this.contestRepository.find({
      where: {
        ...(name && { name: ILike(`%${name}%`) }),
        ...(filters && { ...filters }),
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { ...(orderBy && { [orderBy]: sortBy }) },
      relations: ['participants'],
    });
  }

  async findParticipatedContests(contestantId: string) {
    const participations = await this.contestParticipationRepository.find({
      where: { contestantId },
      relations: ['contest'],
    });

    const contests = participations.map(
      (participation) => participation.contest,
    );

    return contests;
  }

  async create(createContestDto: CreateContestDto) {
    await this.checkUniqueContestName(createContestDto.name);

    try {
      const entity: Contest = this.contestRepository.create(createContestDto);
      return await this.contestRepository.save(entity);
    } catch (error: any) {
      this.logger.fatal(error.message);
      throw new InternalServerErrorException('Cannot create contest');
    }
  }

  async participateContest(contestId: string, contestantId: string) {
    const contest: Contest = await this.findOne(contestId);

    const contestant: Contestant =
      await this.contestantService.findOne(contestantId);

    const isContestParticipated = this.checkParticipatedContest(
      contestant,
      contest,
    );
    if (isContestParticipated) {
      throw new BadRequestException(
        'Contestant is already participated in the contest',
      );
    }

    const participants: Contestant[] = [contestant];
    if (contest.type === ContestType.TEAM) {
      if (!contestant?.team) {
        throw new BadRequestException(
          'Contestant must joined a team to be able to participate in the contest',
        );
      }
      const team = await this.teamService.findOne(contestant.team.id);
      if (!team) {
        throw new BadRequestException(
          'Contestant must joined a team to be able to participate in the contest',
        );
      }

      team.members.forEach((member: Contestant) => {
        if (member.id !== contestant.id) participants.push(member);
      });
    }

    await Promise.all([
      participants.forEach(async (participant: Contestant) => {
        const payload = {
          contestId: contest.id,
          contestantId: participant.id,
        };
        const entity: ContestParticipation =
          this.contestParticipationRepository.create(payload);
        try {
          await this.contestParticipationRepository.save(entity);
        } catch (error: any) {
          this.logger.fatal(error.message);
          throw new InternalServerErrorException(
            'Cannot save contest participation',
          );
        }
      }),
    ]);

    return 'Success';
  }

  async update(id: string, updateContestDto: UpdateContestDto) {
    if (!id) {
      throw new BadRequestException('Contest ID is required');
    }

    await this.checkUniqueContestName(updateContestDto?.name);

    const contest = await this.contestRepository.findOneBy({ id });

    try {
      const entity: Contest = this.contestRepository.merge(
        contest,
        updateContestDto,
      );
      return await this.contestRepository.save(entity);
    } catch (error: any) {
      this.logger.fatal(error.message);
      throw new InternalServerErrorException('Cannot update contest');
    }
  }

  async resignContest(contestId: string, contestantId: string) {
    const contest: Contest = await this.findOne(contestId);
    const contestant: Contestant =
      await this.contestantService.findOne(contestantId);

    const isContestParticipated = this.checkParticipatedContest(
      contestant,
      contest,
    );
    if (!isContestParticipated) {
      throw new BadRequestException(
        'Contestant is not participating in this contest',
      );
    }

    const participants: Contestant[] = [contestant];
    if (contest.type === ContestType.TEAM) {
      if (!contestant?.team) {
        throw new BadRequestException(
          'Contestant must be in a team to resign from team contest',
        );
      }
      const team = await this.teamService.findOne(contestant.team.id);
      if (!team) {
        throw new BadRequestException('Team not found');
      }

      team.members.forEach((member: Contestant) => {
        if (member.id !== contestant.id) participants.push(member);
      });
    }

    try {
      await Promise.all(
        participants.map(async (participant: Contestant) => {
          await this.contestParticipationRepository.delete({
            contestId: contest.id,
            contestantId: participant.id,
          });
        }),
      );
      return 'Success';
    } catch (error: any) {
      this.logger.fatal(error.message);
      throw new InternalServerErrorException('Cannot resign from contest');
    }
  }
}
