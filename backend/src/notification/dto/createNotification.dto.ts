/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateNotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string; // ID of the user receiving the notification

  @IsString()
  @IsNotEmpty()
  message: string; // Notification message content

  @IsString()
  @IsOptional()
  relatedMessageId?: string; // Optional: ID of the related message
}
