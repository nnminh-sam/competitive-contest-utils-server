import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/models/enums/role.enum';
import { ContestantService } from 'src/modules/contestant/contestant.service';
import { RequestedUser } from 'src/common/decorators/user-claim.decorator';
import { UpdateContestantDto } from 'src/modules/contestant/dto/update-contestant.dto';
import { Contestant } from 'src/models/contestant.model';
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { Team } from 'src/models/team.model';
import { AuthPayload } from 'src/modules/auth/dto/jwt-claim.dto';
import { JwtRolesGuard } from 'src/common/guards/jwt-roles.guard';

@ApiTags('Contestants')
@ApiBearerAuth()
@Controller({
  path: 'contestants',
  version: '1',
})
export class ContestantController {
  constructor(private readonly contestantService: ContestantService) {}

  @ApiOperation({ summary: '[Role: All] Get the contestant profile' })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({
    description: 'Returns the authenticated contestant details',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Get('me')
  async findMe(@RequestedUser() contestant: AuthPayload) {
    return await this.contestantService.findOne(contestant.sub);
  }

  @ApiOperation({ summary: '[Role: All] Update contestant profile' })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({
    description: 'Returns the updated contestant object',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContestantDto: UpdateContestantDto,
  ) {
    return await this.contestantService.update(id, updateContestantDto);
  }
}
