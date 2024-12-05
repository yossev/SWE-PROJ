/* eslint-disable prettier/prettier */
// room.controller.ts
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from 'src/models/room-schema';
import { CreateRoomDto } from './dto/createRoom.dto';


@Controller('courses/:courseId/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Create a new room for a specific course
  @Post()
  async createRoom(
    @Param('courseId') courseId: string,
    @Body() createRoomDto: CreateRoomDto
  ): Promise<Room> {
    return this.roomService.createRoom(createRoomDto, courseId);
  }

  // Get rooms by course ID
  @Get()
  async getRoomsByCourse(@Param('courseId') courseId: string): Promise<Room[]> {
    return this.roomService.getRoomsByCourse(courseId);
  }

  // Get room details by ID
  @Get(':id')
  async getRoom(@Param('id') roomId: string): Promise<Room> {
    return this.roomService.getRoomById(roomId);
  }


}
