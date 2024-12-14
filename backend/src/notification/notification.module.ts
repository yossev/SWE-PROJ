/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { Notification, NotificationSchema } from '../models/notification-schema';
import { MessageSchema } from 'models/message-schema';
import { RoomSchema } from 'models/room-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: 'Message', schema: MessageSchema},
      { name: 'Room', schema: RoomSchema}
    ]),
  ],
  providers: [NotificationService],
  exports: [NotificationService], // Export the service so it can be used in other modules
})
export class NotificationModule {}
