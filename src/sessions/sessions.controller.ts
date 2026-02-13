import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AddEventDto } from './dto/add-event.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @ApiOperation({ summary: 'Create or Upsert Session' })
  @Post()
  createSession(@Body() dto: CreateSessionDto) {
    return this.sessionsService.createOrUpsert(dto);
  }

  // Add Event
  @ApiOperation({ summary: 'Add Event to Session' })
  @Post(':sessionId/events')
  addEvent(
    @Param('sessionId') sessionId: string,
    @Body() dto: AddEventDto,
  ) {
    return this.sessionsService.addEvent(sessionId, dto);
  }

  // Get Session with Events
  @ApiOperation({ summary: 'Get Session with Paginated Events' })
  @Get(':sessionId')
  getSession(
    @Param('sessionId') sessionId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.sessionsService.getSessionWithEvents(
      sessionId,
      Number(page),
      Number(limit),
    );
  }

  // Complete Session
  @ApiOperation({ summary: 'Complete Session' })
  @Post(':sessionId/complete')
  completeSession(
    @Param('sessionId') sessionId: string,
  ) {
    return this.sessionsService.completeSession(sessionId);
  }
}
