import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Team } from 'src/models/team.model';
import { CreateTeamDto } from 'src/modules/team/dto/create-team.dto';
import { UpdateTeamDto } from 'src/modules/team/dto/update-team.dto';
import { TeamService } from 'src/modules/team/team.service';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Find team by id' })
  @ApiResponseWrapper(Team)
  @ApiOkResponse({ description: 'Team found' })
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.teamService.findOne(id);
  }

  @ApiOperation({ summary: 'Create new team' })
  @ApiResponseWrapper(Team)
  @ApiOkResponse({ description: 'Create team success' })
  @ApiBadRequestResponse({
    description: 'Team name has been taken or team member not exist',
  })
  @Post()
  async create(
    @Body()
    createTeamDto: CreateTeamDto,
  ) {
    return await this.teamService.create(createTeamDto);
  }

  @ApiOperation({ summary: 'Update team information' })
  @ApiResponseWrapper(Team)
  @ApiOkResponse({ description: 'Update team success' })
  @ApiBadRequestResponse({
    description: 'Team name has been taken or team member not exist',
  })
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body()
    updateTeamDto: UpdateTeamDto,
  ) {
    return await this.teamService.update(id, updateTeamDto);
  }
}
