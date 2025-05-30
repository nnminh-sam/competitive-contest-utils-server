import { FindAffiliationDto } from './dto/find-affiliation.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Affiliation } from 'src/models/affiliation.model';
import { CreateAffiliationDto } from 'src/modules/affiliation/dto/create-affiliation.dto';
import { UpdateAffiliationDto } from 'src/modules/affiliation/dto/update-affiliation.dto';
import { ILike, Not, Repository } from 'typeorm';

@Injectable()
export class AffiliationService {
  private logger: Logger = new Logger(AffiliationService.name);

  constructor(
    @InjectRepository(Affiliation)
    private readonly affiliationRepository: Repository<Affiliation>,
  ) {}

  async find({ page, limit, orderBy, sortBy, name }: FindAffiliationDto) {
    const skip: number = (page - 1) * limit;
    const queryBuilder = this.affiliationRepository
      .createQueryBuilder('affiliation')
      .where('affiliation.name != :adminName', { adminName: 'admin' });

    if (name) {
      queryBuilder.andWhere('affiliation.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    return await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy(`affiliation.${orderBy}`, sortBy.toUpperCase() as 'ASC' | 'DESC')
      .getMany();
  }

  async existedById(id: string) {
    return await this.affiliationRepository.existsBy({ id });
  }

  async findById(id: string) {
    return await this.affiliationRepository.findOne({
      where: { id },
    });
  }

  async findOneBy(findAffiliationDto: FindAffiliationDto) {
    return await this.affiliationRepository.findOne({
      where: { name: ILike(findAffiliationDto.name) },
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

  async update(id: string, updateAffiliationDto: UpdateAffiliationDto) {
    const existAffiliation = await this.affiliationRepository.existsBy({
      name: updateAffiliationDto.name,
    });
    if (existAffiliation)
      throw new BadRequestException('Affiliation name has been taken');

    const entity = await this.affiliationRepository.findOneBy({ id });
    if (!entity) throw new BadRequestException('Invalid id');

    try {
      const mergedEntity = this.affiliationRepository.merge(
        entity,
        updateAffiliationDto,
      );
      return await this.affiliationRepository.save(mergedEntity);
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException('Cannot update affiliation');
    }
  }
}
