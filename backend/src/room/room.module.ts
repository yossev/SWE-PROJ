/* eslint-disable prettier/prettier */
// room.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Course, CourseSchema } from 'src/models/course-schema';
import { Room, RoomSchema } from 'src/models/room-schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    //CourseModule, // Import the CourseModule to use Course services
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports:[RoomService]
})
export class RoomModule {}
