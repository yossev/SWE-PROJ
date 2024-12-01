/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

// Enum for chat type (group or individual)
export enum ChatType {
  GROUP = 'group',
  INDIVIDUAL = 'individual',
}

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // ID of the user sending the message

  @IsString()
  @IsNotEmpty()
  content: string; // Content of the message

  @IsString()
  @IsNotEmpty()
  roomId: string; // The room where the message is being sent (group or individual)

  @IsEnum(ChatType)
  chatType: ChatType; // Type of chat, either group or individual

  @IsString()
  @IsOptional()
  recipientId?: string; // Recipient ID (for individual chat only, optional)
}

