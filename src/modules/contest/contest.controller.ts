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
import { RegisterTeamContestDto } from 'src/modules/contest/dto/register-team-contest.dto';

@ApiTags('Contests')
@ApiBearerAuth()
@Controller({
  path: 'contests',
  version: '1',
})
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @ApiOperation({ summary: 'Find contest by ID' })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Contest found' })
  @ApiBadRequestResponse({ description: 'Contest not found' })
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.contestService.findOne(id);
  }

  @ApiOperation({ summary: 'Find contests' })
  @ApiResponseArrayWrapper(Contest)
  @ApiOkResponse({ description: 'Success' })
  @Get('')
  async find(@Query() findContestDto: FindContestDto) {
    return await this.contestService.find(findContestDto);
  }

  @ApiOperation({ summary: 'Create a new contest' })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Contest created successfully' })
  @ApiBadRequestResponse({ description: 'Contest name has been taken' })
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createContestDto: CreateContestDto) {
    return await this.contestService.create(createContestDto);
  }

  @ApiOperation({
    summary: 'Contestant register for a contest of a single type contest',
  })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Registered created successfully' })
  @ApiBadRequestResponse({
    description:
      'Contest not found, contestant not found or contestant has been registered',
  })
  @UseGuards(JwtGuard)
  @Post(':id/register-single')
  async registerSingleContestant(
    @Param('id') id: string,
    @Body() registerSingleContestDto: RegisterSingleContestDto,
  ) {
    return this.contestService.registerSingleContestant(
      id,
      registerSingleContestDto.contestantId,
    );
  }

  @ApiOperation({
    summary: 'Tean register for a contest of a team type contest',
  })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Registered created successfully' })
  @ApiBadRequestResponse({
    description:
      'Contest not found, team not found or team has been registered',
  })
  @UseGuards(JwtGuard)
  @Post(':id/register-team')
  async registerTeamContestant(
    @Param('id') id: string,
    @Body() registerTeamContestDto: RegisterTeamContestDto,
  ) {
    return this.contestService.registerSingleContestant(
      id,
      registerTeamContestDto.teamId,
    );
  }

  @ApiOperation({ summary: 'Update contest information' })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Contest updated successfully' })
  @ApiBadRequestResponse({ description: 'Contest not found' })
  @UseGuards(JwtGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateContestDto: UpdateContestDto,
  ) {
    return await this.contestService.update(id, updateContestDto);
  }
}
