import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './schemas/session.schema';
import { Event } from './schemas/event.schema';
import { AddEventDto } from './dto/add-event.dto';
import { SessionStatus } from './schemas/session.schema';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: Model<Session>,

    @InjectModel(Event.name)
    private eventModel: Model<Event>,
  ) {}

  // Create or Upsert Session

  async createOrUpsert(dto: CreateSessionDto) {
  try {
    const session = await this.sessionModel.findOneAndUpdate(
      { sessionId: dto.sessionId },
      {
        $setOnInsert: {
          sessionId: dto.sessionId,
          status: dto.status || SessionStatus.INITIATED,
          language: dto.language,
          metadata: dto.metadata || {},
          startedAt: new Date(),
          endedAt: null,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return session;
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return this.sessionModel.findOne({ sessionId: dto.sessionId });
    }
    throw error;
  }
}

  // 1️⃣ Add Event
  async addEvent(sessionId: string, dto: AddEventDto) {
    const session = await this.sessionModel.findOne({ sessionId });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if(session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Cannot add events to a completed session');
    }

    try {
      const event = await this.eventModel.create({
        ...dto,
        sessionId,
        timestamp: new Date(dto.timestamp),
      });

      return event;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Event with same eventId already exists for this session',
        );
      }
      throw error;
    }
  }

  // 2️⃣ Get Session with Events (Pagination)
  async getSessionWithEvents(
    sessionId: string,
    page = 1,
    limit = 10,
  ) {
    const session = await this.sessionModel.findOne({ sessionId });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const skip = (page - 1) * limit;

    const events = await this.eventModel
      .find({ sessionId })
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit);

    const total = await this.eventModel.countDocuments({ sessionId });

    return {
      session,
      events,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  // 3️⃣ Complete Session (Idempotent)
  async completeSession(sessionId: string) {
    const session = await this.sessionModel.findOne({ sessionId });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status === 'completed') {
      return {
        message: 'Session already completed',
        session,
      };
    }

    session.status = SessionStatus.COMPLETED;
    session.endedAt = new Date();

    await session.save();

    return {
      message: 'Session completed successfully',
      session,
    };
  }
}
