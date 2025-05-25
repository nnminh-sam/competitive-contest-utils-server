import {
  Body,
  Controller,
  Delete,
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
import { ApiResponseArrayWrapper } from 'src/common/decorators/api-response-array-wrapper.decorator';
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtRolesGuard } from 'src/common/guards/jwt-roles.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Contest } from 'src/models/contest.model';
import { RoleEnum } from 'src/models/enums/role.enum';
import { Team } from 'src/models/team.model';
import { CreateTeamDto } from 'src/modules/team/dto/create-team.dto';
import { UpdateTeamDto } from 'src/modules/team/dto/update-team.dto';
import { TeamService } from 'src/modules/team/team.service';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller({
  path: 'teams',
  version: '1',
})
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: '[Role: Contestant] Find team by id' })
  @ApiResponseWrapper(Team)
  @ApiOkResponse({ description: 'Team found' })
  @UseGuards(JwtRolesGuard)
  @Roles(RoleEnum.CONTESTANT)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.teamService.findOne(id);
  }

  @ApiOperation({ summary: '[Role: Contestant] Create new team' })
  @ApiResponseWrapper(Team)
  @ApiOkResponse({ description: 'Create team success' })
  @ApiBadRequestResponse({
    description: 'Team name has been taken or team member not exist',
  })
  @UseGuards(JwtGuard)
  @Roles(RoleEnum.CONTESTANT)
  @Post()
  async create(
    @Body()
    createTeamDto: CreateTeamDto,
  ) {
    return await this.teamService.create(createTeamDto);
  }

  @ApiOperation({ summary: '[Role: Contestant] Update team information' })
  @ApiResponseWrapper(Team)
  @ApiOkResponse({ description: 'Update team success' })
  @ApiBadRequestResponse({
    description: 'Team name has been taken or team member not exist',
  })
  @UseGuards(JwtRolesGuard)
  @Roles(RoleEnum.CONTESTANT)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body()
    updateTeamDto: UpdateTeamDto,
  ) {
    return await this.teamService.update(id, updateTeamDto);
  }

  @ApiOperation({ summary: '[Role: Contestant] Delete team' })
  @ApiResponseWrapper(String)
  @ApiOkResponse({ description: 'Team deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Team not found or cannot delete team',
  })
  @UseGuards(JwtRolesGuard)
  @Roles(RoleEnum.CONTESTANT)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.teamService.delete(id);
  }
}
