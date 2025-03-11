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
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/common/decorators/api-response-wrapper.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Contest } from 'src/models/contest.model';
import { CreateContestDto } from 'src/modules/contest/dto/create-contest.dto';
import { UpdateContestDto } from 'src/modules/contest/dto/update-contest.dto';
import { ContestService } from 'src/modules/contest/contest.service';

@ApiTags('Contests')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('contests')
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

  @ApiOperation({ summary: 'Create a new contest' })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Contest created successfully' })
  @ApiBadRequestResponse({ description: 'Contest name has been taken' })
  @Post()
  async create(@Body() createContestDto: CreateContestDto) {
    return await this.contestService.create(createContestDto);
  }

  @ApiOperation({ summary: 'Update contest information' })
  @ApiResponseWrapper(Contest)
  @ApiOkResponse({ description: 'Contest updated successfully' })
  @ApiBadRequestResponse({ description: 'Contest not found' })
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateContestDto: UpdateContestDto,
  ) {
    return await this.contestService.update(id, updateContestDto);
  }
}
