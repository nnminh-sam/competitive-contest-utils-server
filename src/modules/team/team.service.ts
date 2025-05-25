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

  async findOne(id: string) {
    if (!id) return null;
    return await this.teamRepository.findOne({
      where: { id },
      relations: ['members'],
    });
  }

  async create(createTeamDto: CreateTeamDto) {
    const isTeamNameUsed = await this.teamRepository.existsBy({
      name: createTeamDto.name,
    });
    if (isTeamNameUsed) throw new BadRequestException('Name has been taken');

    if (createTeamDto.members.length !== 3)
      throw new BadRequestException('Invalid team size! Team size must be 3');

    // Check for duplicate emails
    const uniqueEmails = new Set(createTeamDto.members);
    if (uniqueEmails.size !== createTeamDto.members.length) {
      throw new BadRequestException(
        'Duplicate email addresses are not allowed',
      );
    }

    const contestants: Contestant[] = await Promise.all(
      createTeamDto.members.map((email: string) => {
        return this.contestantService.findOneBy({ email });
      }),
    );

    // Check which emails are not found
    const notFoundEmails = createTeamDto.members.filter(
      (email, index) => contestants[index] === null,
    );
    if (notFoundEmails.length > 0) {
      throw new BadRequestException(
        `Contestants not found with emails: ${notFoundEmails.join(', ')}`,
      );
    }

    // Check if any contestant is already in a team
    const contestantsInTeam = contestants.filter(
      (contestant) => contestant?.team !== null,
    );
    if (contestantsInTeam.length > 0) {
      throw new BadRequestException(
        `Contestants already in teams: ${contestantsInTeam
          .map((c) => c.email)
          .join(', ')}`,
      );
    }

    try {
      // Create the team first
      const teamEntity = this.teamRepository.create({
        ...createTeamDto,
        members: contestants,
      });
      const team = await this.teamRepository.save(teamEntity);

      // Update team reference for each contestant
      await Promise.all(
        contestants.map(async (contestant) => {
          await this.contestantService.updateTeam(contestant.id, team);
        }),
      );

      // Fetch the team again with updated member references
      return await this.teamRepository.findOne({
        where: { id: team.id },
        relations: ['members'],
      });
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot create team');
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const isTeamNameTaken =
      updateTeamDto?.name &&
      (await this.teamRepository.existsBy({
        name: updateTeamDto?.name,
      }));
    if (isTeamNameTaken) throw new BadRequestException('Name has been taken');

    if (updateTeamDto.members.length !== 3)
      throw new BadRequestException('Invalid team size! Team size must be 3');

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

  async delete(id: string) {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    }

    try {
      // Remove team reference from all members
      await Promise.all(
        team.members.map(async (member) => {
          member.team = null;
          await this.contestantService.update(member.id, {});
        }),
      );

      // Delete the team
      await this.teamRepository.remove(team);
      return 'Success';
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot delete team');
    }
  }
}
