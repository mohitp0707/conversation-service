import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsObject, IsDateString } from 'class-validator';
import { EventType } from '../schemas/event.schema';

export class AddEventDto {
  @ApiProperty({
    description: 'Unique event identifier within a session',
    example: 'event-001',
  })
  @IsString()
  eventId: string;

  @ApiProperty({
    description: 'Type of conversation event',
    enum: EventType,
    example: EventType.USER_SPEECH,
  })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({
    description: 'Payload data of the event',
    example: { text: 'Hello, I need support' },
  })
  @IsObject()
  payload: Record<string, any>;

  @ApiProperty({
    description: 'Event timestamp in ISO format',
    example: '2026-02-13T10:05:00.000Z',
  })
  @IsDateString()
  timestamp: string;
}
