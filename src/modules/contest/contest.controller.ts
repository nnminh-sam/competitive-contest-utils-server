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
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Contest } from 'src/models/contest.model';
import { CreateContestDto } from 'src/modules/contest/dto/create-contest.dto';
import { UpdateContestDto } from 'src/modules/contest/dto/update-contest.dto';
import { ContestService } from 'src/modules/contest/contest.service';
import { FindContestDto } from 'src/modules/contest/dto/find-contest.dto';
import { ApiResponseArrayWrapper } from 'src/common/decorators/api-response-array-wrapper.decorator';
import { RegisterSingleContestDto } from 'src/modules/contest/dto/register-single-contest.dto';
import { RequestedUser } from 'src/common/decorators/user-claim.decorator';
import { Contestant } from 'src/models/contestant.model';
import { JwtRolesGuard } from 'src/common/guards/jwt-roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/models/enums/role.enum';
import { AuthPayload } from 'src/modules/auth/dto/jwt-claim.dto';

@ApiTags('Contests')
@Controller({
  path: 'contests',
  version: '1',
})
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @ApiOperation({ summary: '[Role: None - Public API] Find contest by ID' })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Contest found' })
  @ApiBadRequestResponse({ description: 'Contest not found' })
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.contestService.findOne(id);
  }

  @ApiOperation({ summary: '[Role: None - Public API] Find contests' })
  @ApiResponseArrayWrapper(Contest)
  @ApiOkResponse({ description: 'Success' })
  @Get('')
  async find(@Query() findContestDto: FindContestDto) {
    return await this.contestService.find(findContestDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '[Role: Admin] Create a new contest' })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Contest created successfully' })
  @ApiBadRequestResponse({ description: 'Contest name has been taken' })
  @UseGuards(JwtRolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Post()
  async create(@Body() createContestDto: CreateContestDto) {
    return await this.contestService.create(createContestDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[Role: Contestant] Contestant register for a contest of a single type contest',
  })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Registered created successfully' })
  @ApiBadRequestResponse({
    description:
      'Contest not found, contestant not found or contestant has been registered',
  })
  @UseGuards(JwtRolesGuard)
  @Roles(RoleEnum.CONTESTANT)
  @Post('/:id/participations')
  async registerSingleContestant(
    @Param('id') id: string,
    @RequestedUser() claims: AuthPayload,
  ) {
    return this.contestService.registerContestant(id, claims.sub);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '[Role: Admin] Update contest information' })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Contest updated successfully' })
  @ApiBadRequestResponse({ description: 'Contest not found' })
  @UseGuards(JwtRolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateContestDto: UpdateContestDto,
  ) {
    return await this.contestService.update(id, updateContestDto);
  }
}
