/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { Room, RoomDocument } from 'src/models/room-schema';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDocument } from 'src/models/course-schema';
import { MessageDocument } from 'src/models/message-schema';

@Controller('courses/:courseId/rooms')
export class RoomController {
  constructor(
  @InjectModel('Message') private readonly messageModel: Model<MessageDocument>,
  @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
  @InjectModel('Course') private readonly courseModel : Model<CourseDocument>,

    
  private readonly roomService: RoomService) {}

  // Create a group chat room for a course
  @Post()
async createRoom(
  @Body() createRoomDto: CreateRoomDto, // Room data from the request body
  @Param('courseId') courseId: Types.ObjectId, // Course ID from the route params
  @Body('userId') userId: Types.ObjectId // User ID from the request body
): Promise<Room> {
  // Step 1: Find the course by its ID
  const course = await this.courseModel.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Step 2: Check if the user is enrolled in the course
  const userIsEnrolled = course.students.some(
    (student: mongoose.Types.ObjectId) => student.toString() === userId.toString()
  );
  if (!userIsEnrolled) {
    throw new Error('User is not enrolled in the course');
  }

  // Step 3: Create the room
  const room = new this.roomModel({
    ...createRoomDto,
    course: courseId, // Pass the course ObjectId to the room
  });

  // Step 4: Save and return the room
  return room.save();
}

  
  // Get a specific room by its ID
  @Get('name/:name')
  async getRoomByName(@Param('name') roomName: string): Promise<Room> {
    return this.roomService.getRoomByName(roomName);
  }

  // Create a private chat room between a student and instructor
  @Post('private/:courseId')
  async createPrivateRoom(
    @Body() createRoomDto: CreateRoomDto,      // The room creation DTO
    @Param('courseId') courseId: string,       // Course ID from URL param
    @Param('userId') userId: string                       // Access the request object
  ) {
    const courseIdObj = new Types.ObjectId(courseId);
    const loggedInUserIdObj = new Types.ObjectId(userId); // Access the logged-in user's ID from the request

    // Now call the service to create the room
    return this.roomService.createPrivateRoom(loggedInUserIdObj, createRoomDto, courseIdObj);
  }
  
}
