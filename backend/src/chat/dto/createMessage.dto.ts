import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // ID of the user sending the message

  @IsString()
  @IsNotEmpty()
  content: string; // Content of the message

  @IsString()
  @IsNotEmpty()
  roomId: string; // The room where the message is being sent
}