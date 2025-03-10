import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ContestantService } from 'src/contestant/contestant.service';
import { UserClaim } from 'src/auth/decorator/user-claim.decorator';
import { JwtClaimDto } from 'src/auth/dto/jwt-claim.dto';
import { UpdateContestantDto } from 'src/contestant/dto/update-contestant.dto';

@UseGuards(JwtGuard)
@Controller('contestants')
export class ContestantController {
  constructor(private readonly contestantService: ContestantService) {}

  @Get('me')
  async findMe(@UserClaim() claim: JwtClaimDto) {
    return await this.contestantService.findOne(claim.sub);
  }

  @Patch()
  async update(
    @UserClaim() claim: JwtClaimDto,
    @Body() updateContestantDto: UpdateContestantDto,
  ) {
    return await this.contestantService.update(claim.sub, updateContestantDto);
  }
}
