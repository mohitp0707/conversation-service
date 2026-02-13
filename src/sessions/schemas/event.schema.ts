import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

export enum EventType {
  USER_SPEECH = 'user_speech',
  BOT_SPEECH = 'bot_speech',
  SYSTEM = 'system',
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({
    required: true,
    enum: EventType,
  })
  type: EventType;

  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  @Prop({ required: true })
  timestamp: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

/**
 * Compound unique index
 * Prevent duplicate eventId per session
 */
EventSchema.index(
  { sessionId: 1, eventId: 1 },
  { unique: true },
);
