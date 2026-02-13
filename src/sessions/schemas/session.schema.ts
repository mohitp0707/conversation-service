import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

export enum SessionStatus {
  INITIATED = 'initiated',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Schema({
  timestamps: true, // automatically adds createdAt & updatedAt
})
export class Session {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  sessionId: string;

  @Prop({
    required: true,
    enum: SessionStatus,
    default: SessionStatus.INITIATED,
  })
  status: SessionStatus;

  @Prop({
    required: true,
  })
  language: string;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  startedAt: Date;

  @Prop({
    type: Date,
    default: null,
  })
  endedAt: Date | null;

  @Prop({
    type: Object,
    required: false,
  })
  metadata?: Record<string, any>;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
