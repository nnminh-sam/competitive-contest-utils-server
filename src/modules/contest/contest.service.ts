import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contest } from 'src/models/contest.model';
import { CreateContestDto } from 'src/modules/contest/dto/create-contest.dto';
import { UpdateContestDto } from 'src/modules/contest/dto/update-contest.dto';

@Injectable()
export class ContestService {
  private readonly logger: Logger = new Logger(ContestService.name);

  constructor(
    @InjectRepository(Contest)
    private readonly contestRepository: Repository<Contest>,
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
