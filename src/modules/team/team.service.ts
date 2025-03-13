import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contestant } from 'src/models/contestant.model';
import { Team } from 'src/models/team.model';
import { ContestantService } from 'src/modules/contestant/contestant.service';
import { CreateTeamDto } from 'src/modules/team/dto/create-team.dto';
import { UpdateTeamDto } from 'src/modules/team/dto/update-team.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  private readonly logger: Logger = new Logger(TeamService.name);

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly contestantService: ContestantService,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const isTeamNameUsed = await this.teamRepository.existsBy({
      name: createTeamDto.name,
    });
    if (isTeamNameUsed) throw new BadRequestException('Name has been taken');

    const contestants: Contestant[] = await Promise.all(
      createTeamDto.members.map((email: string) => {
        return this.contestantService.findOneBy({ email });
      }),
    );
    if (contestants.includes(null))
      throw new BadRequestException('Contestant not found');

    try {
      const teamEntity = this.teamRepository.create({
        ...createTeamDto,
        members: contestants,
      });
      const team = await this.teamRepository.save(teamEntity);
      return team;
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot create team');
    }
  }

  async findOne(id: string) {
    if (!id) return null;
    return await this.teamRepository.findOne({
      where: { id },
      relations: ['members'],
    });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const isTeamNameTaken =
      updateTeamDto?.name &&
      (await this.teamRepository.existsBy({
        name: updateTeamDto?.name,
      }));
    if (isTeamNameTaken) throw new BadRequestException('Name has been taken');

    const team: Team = await this.teamRepository.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!team) throw new BadRequestException('Invalid id');

    const contestants: Contestant[] = updateTeamDto?.members
      ? await Promise.all(
          updateTeamDto.members.map((email: string) =>
            this.contestantService.findOneBy({ email }),
          ),
        )
      : [];
    if (contestants.length !== 0 && contestants.includes(null))
      throw new BadRequestException('Contestant not found');

    try {
      const mergedEntity = this.teamRepository.merge(team, {
        ...updateTeamDto,
        ...(contestants.length !== 0 && {
          members: contestants,
        }),
      });
      return await this.teamRepository.save(mergedEntity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot update team');
    }
  }
}
