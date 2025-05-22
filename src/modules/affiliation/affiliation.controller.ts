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
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtRolesGuard } from 'src/common/guards/jwt-roles.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Affiliation } from 'src/models/affiliation.model';
import { RoleEnum } from 'src/models/enums/role.enum';
import { AffiliationService } from 'src/modules/affiliation/affiliation.service';
import { CreateAffiliationDto } from 'src/modules/affiliation/dto/create-affiliation.dto';
import { FindAffiliationDto } from 'src/modules/affiliation/dto/find-affiliation.dto';
import { UpdateAffiliationDto } from 'src/modules/affiliation/dto/update-affiliation.dto';

@ApiTags('Affiliations')
@Controller({
  path: 'affiliations',
  version: '1',
})
export class AffiliationController {
  constructor(private readonly affiliationService: AffiliationService) {}

  @ApiOperation({ summary: '[Role: None - Public API] Find affiliations' })
  @ApiResponseArrayWrapper(Affiliation)
  @ApiOkResponse({ description: 'Find process completed' })
  @Get()
  async find(
    @Query()
    findAffiliationDto: FindAffiliationDto,
  ) {
    return await this.affiliationService.find(findAffiliationDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Role: Admin] Create new affiliation',
  })
  @ApiResponseWrapper(Affiliation)
  @ApiOkResponse({ description: 'Successfully created new affiliation' })
  @ApiBadRequestResponse({ description: 'Affiliation name has been taken' })
  @UseGuards(JwtRolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Post()
  async create(
    @Body()
    createAffiliationDto: CreateAffiliationDto,
  ) {
    return await this.affiliationService.create(createAffiliationDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '[Role: Admin] Update affiliation' })
  @ApiOkResponse({ description: 'Successfully updated affiliation' })
  @ApiBadRequestResponse({ description: 'Affiliation name has been taken' })
  @ApiResponseWrapper(Affiliation)
  @UseGuards(JwtRolesGuard)
  @Roles(RoleEnum.ADMIN)
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
