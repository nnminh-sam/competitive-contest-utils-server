import { FindAffiliationDto } from './dto/find-affiliation.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Affiliation } from 'src/models/affiliation.model';
import { CreateAffiliationDto } from 'src/modules/affiliation/dto/create-affiliation.dto';
import { UpdateAffiliationDto } from 'src/modules/affiliation/dto/update-affiliation.dto';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class AffiliationService {
  private logger: Logger = new Logger(AffiliationService.name);

  constructor(
    @InjectRepository(Affiliation)
    private readonly affiliationRepository: Repository<Affiliation>,
  ) {}

  async find({ page, limit, orderBy, sortBy, name }: FindAffiliationDto) {
    const skip: number = page * limit;
    return await this.affiliationRepository.find({
      where: { name: ILike(name) },
      skip,
      take: limit,
      order: { [orderBy]: sortBy },
    });
  }

  async create(createAffiliationDto: CreateAffiliationDto) {
    const existAffiliation = await this.affiliationRepository.existsBy({
      name: createAffiliationDto.name,
    });
    if (existAffiliation)
      throw new BadRequestException('Affiliation name has been taken');

    try {
      const entity = this.affiliationRepository.create(createAffiliationDto);
      return await this.affiliationRepository.save(entity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot create affiliation');
    }
  }

  async update(updateAffiliationDto: UpdateAffiliationDto) {
    const affiliation = await this.affiliationRepository.findOneBy({
      name: updateAffiliationDto.name,
    });
    if (affiliation)
      throw new BadRequestException('Affiliation name has been taken');
    try {
      const mergedEntity = this.affiliationRepository.merge(
        affiliation,
        updateAffiliationDto,
      );
      return await this.affiliationRepository.save(mergedEntity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot update affiliation');
    }
  }
}
