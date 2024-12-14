import { Controller, Post, Get, Param, Body , Res , Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { Room, RoomDocument } from 'src/models/room-schema';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from 'models/message-schema';
import { CourseDocument } from 'models/course-schema';
import { PassThrough } from 'stream';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('courses/rooms')
export class RoomController {
  constructor(
  @InjectModel('Message') private readonly messageModel: Model<MessageDocument>,
  @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
  @InjectModel('Course') private readonly courseModel : Model<CourseDocument>,

    
  private readonly roomService: RoomService) {}

  // Create a group chat room for a course
  @Post(':courseId')
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

  /*
  // Step 2: Check if the user is enrolled in the course
  const userIsEnrolled = course.students.some(
    (student: mongoose.Types.ObjectId) => student.toString() === userId.toString()
  );
  if (!userIsEnrolled) {
    throw new Error('User is not enrolled in the course');
  }
    */

  // Step 3: Create the room
  const room = new this.roomModel({
    ...createRoomDto,
    course_id: courseId, // Pass the course ObjectId to the room
  });

  // Step 4: Save and return the room
  return room.save();
}

  @Post('join_room/:name')
  async joinRoom(@Param('name') roomName : string , @Req() req)
  {
    const id = req.cookies["userId"];
    return await this.roomService.joinRoom(roomName , id);
  }

  @Post('leave_room/:name')
  async leaveRoom(@Param('name') roomName : string , @Req() req)
  {
    const id = req.cookies["userId"];
    return await this.roomService.leaveRoom(roomName , id);
  }

  @Public()
  @Get('getMessages/:id')
  async getAllMessages(@Param('id') roomId : string)
  {
    const messages = await this.messageModel.find({room_id : new Types.ObjectId(roomId)});
    return messages;
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
