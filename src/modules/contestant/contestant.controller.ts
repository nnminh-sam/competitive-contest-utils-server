import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { ContestantService } from 'src/modules/contestant/contestant.service';
import { RequestedUser } from 'src/common/decorators/user-claim.decorator';
import { UpdateContestantDto } from 'src/modules/contestant/dto/update-contestant.dto';
import { Contestant } from 'src/models/contestant.model';
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { JwtClaimDto } from 'src/modules/auth/dto/jwt-claim.dto';
import { Team } from 'src/models/team.model';
import { ApiResponseArrayWrapper } from 'src/common/decorators/api-response-array-wrapper.decorator';
import { Contest } from 'src/models/contest.model';

@ApiTags('Contestants')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({
  path: 'contestants',
  version: '1',
})
export class ContestantController {
  constructor(private readonly contestantService: ContestantService) {}

  @ApiOperation({ summary: 'Get the contestant profile' })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({
    description: 'Returns the authenticated contestant details',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  async findMe(@RequestedUser() contestant: Contestant) {
    return contestant;
  }

  @ApiOperation({ summary: 'Get list of joined team' })
  @ApiResponseWrapper(Team)
  @ApiOkResponse({
    description: 'Returns a list of joined team',
  })
  @Get('joined-team')
  async findJoinedTeam(@RequestedUser() contestant: Contestant) {
    return await this.contestantService.findJoinedTeam(contestant.id);
  }

  @ApiOperation({ summary: 'Get list of participated contests of type single' })
  @ApiResponseArrayWrapper(Contest)
  @ApiOkResponse({
    description: 'Returns a list of participated contests of type single',
  })
  @Get('participated-single-contests')
  async findParticipatedSingleContests(
    @RequestedUser() contestant: Contestant,
  ) {
    return await this.contestantService.findParticipatedContests(contestant.id);
  }

  @ApiOperation({ summary: 'Get list of participated contests' })
  @ApiResponseArrayWrapper(Contest)
  @ApiOkResponse({
    description: 'Returns a list of participated contests',
  })
  @Get('participated-contests')
  async findParticipatedContests(@RequestedUser() contestant: Contestant) {
    return await this.contestantService.findAllParticipatedContests(
      contestant.id,
    );
  }

  @ApiOperation({ summary: 'Update contestant profile' })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({
    description: 'Returns the updated contestant object',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Body() updateContestantDto: UpdateContestantDto,
  ) {
    return await this.contestantService.update(id, updateContestantDto);
  }
}
