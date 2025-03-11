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
import { UserClaim } from 'src/common/decorators/user-claim.decorator';
import { UpdateContestantDto } from 'src/modules/contestant/dto/update-contestant.dto';
import { Contestant } from 'src/models/contestant.model';
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { JwtClaimDto } from 'src/modules/auth/dto/jwt-claim.dto';

@ApiTags('Contestants')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('contestants')
export class ContestantController {
  constructor(private readonly contestantService: ContestantService) {}

  @ApiOperation({ summary: 'Get the currently authenticated contestant' })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({
    description: 'Returns the authenticated contestant details',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  async findMe(@UserClaim() claim: JwtClaimDto) {
    return await this.contestantService.findOne(claim.sub);
  }

  @ApiOperation({ summary: 'Update contestant profile' })
  @ApiResponseWrapper(Contestant)
  @ApiOkResponse({
    description: 'Returns the updated contestant object',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch()
  async update(
    @UserClaim() claim: JwtClaimDto,
    @Body() updateContestantDto: UpdateContestantDto,
  ) {
    return await this.contestantService.update(claim.sub, updateContestantDto);
  }
}
