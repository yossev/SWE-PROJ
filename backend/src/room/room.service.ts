/* eslint-disable prettier/prettier */
// room.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'models/course-schema';
import { Room } from 'models/room-schema';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/createRoom.dto';


@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Course.name) private courseModel: Model<Course>
  ) {}

  // Create a new room for a specific course
  async createRoom(createRoomDto: CreateRoomDto, courseId: string): Promise<Room> {
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new Error('Course not found');
    
    const room = new this.roomModel({
      ...createRoomDto,
      course: courseId,
    });
    return room.save();
  }

  // Get rooms by course ID
  async getRoomsByCourse(courseId: string): Promise<Room[]> {
    return this.roomModel.find({ course: courseId }).populate('users');
  }

  // Get room details by ID
  async getRoomById(roomId: string): Promise<Room> {
    return this.roomModel.findById(roomId).populate('users');
  }

  // Mark room as inactive
  async setRoomInactive(roomId: string): Promise<Room> {
    return this.roomModel.findByIdAndUpdate(roomId, { active: false }, { new: true });
  }

}
