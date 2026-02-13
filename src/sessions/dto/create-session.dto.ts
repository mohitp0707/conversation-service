import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum SessionStatus {
  INITIATED = 'initiated',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class CreateSessionDto {
  @ApiProperty({
    description: 'Unique session identifier provided externally',
    example: 'session-1001',
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Current lifecycle status of session',
    enum: SessionStatus,
    example: SessionStatus.INITIATED,
  })
  @IsEnum(SessionStatus)
  status: SessionStatus;

  @ApiProperty({
    description: 'Language of the conversation',
    example: 'en',
  })
  @IsString()
  language: string;

  @ApiPropertyOptional({
    description: 'Optional metadata related to session',
    example: {
      source: 'ivr',
      callerId: '+1234567890',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
