import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseArrayWrapper } from 'src/common/decorators/api-response-array-wrapper.decorator';
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Affiliation } from 'src/models/affiliation.model';
import { AffiliationService } from 'src/modules/affiliation/affiliation.service';
import { CreateAffiliationDto } from 'src/modules/affiliation/dto/create-affiliation.dto';
import { FindAffiliationDto } from 'src/modules/affiliation/dto/find-affiliation.dto';
import { UpdateAffiliationDto } from 'src/modules/affiliation/dto/update-affiliation.dto';

@ApiTags('Affiliations')
@ApiBearerAuth()
@Controller({
  path: 'affiliations',
  version: '1',
})
export class AffiliationController {
  constructor(private readonly affiliationService: AffiliationService) {}

  @ApiOperation({ description: 'Find affiliations' })
  @ApiResponseArrayWrapper(Affiliation)
  @ApiOkResponse({ description: 'Find process completed' })
  @Get()
  async find(
    @Query()
    findAffiliationDto: FindAffiliationDto,
  ) {
    return await this.affiliationService.find(findAffiliationDto);
  }

  @ApiOperation({ description: 'Create new affiliation' })
  @ApiResponseWrapper(Affiliation)
  @ApiOkResponse({ description: 'Successfully created new affiliation' })
  @ApiBadRequestResponse({ description: 'Affiliation name has been taken' })
  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body()
    createAffiliationDto: CreateAffiliationDto,
  ) {
    return await this.affiliationService.create(createAffiliationDto);
  }

  @ApiOperation({ description: 'Update new affiliation' })
  @ApiOkResponse({ description: 'Successfully updated new affiliation' })
  @ApiBadRequestResponse({ description: 'Affiliation name has been taken' })
  @ApiResponseWrapper(Affiliation)
  @UseGuards(JwtGuard)
  @Patch('/:id')
  async update(
    @Param('id')
    id: string,
    @Body()
    updateAffiliationDto: UpdateAffiliationDto,
  ) {
    return await this.affiliationService.update(id, updateAffiliationDto);
  }
}
