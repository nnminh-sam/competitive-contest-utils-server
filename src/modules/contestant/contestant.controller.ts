import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
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

@ApiTags('Contestants')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({
  path: 'contestants',
  version: '1',
})
export class ContestantController {
  constructor(private readonly contestantService: ContestantService) {}

  @ApiOperation({ summary: 'Get the currently authenticated contestant' })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({
    description: 'Returns the authenticated contestant details',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  async findMe(@RequestedUser() contestant: Contestant) {
    return contestant;
  }

  @ApiOperation({ summary: 'Update contestant profile' })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({
    description: 'Returns the updated contestant object',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch()
  async update(
    @RequestedUser() contestant: Contestant,
    @Body() updateContestantDto: UpdateContestantDto,
  ) {
    return await this.contestantService.update(
      contestant.id,
      updateContestantDto,
    );
  }
}
