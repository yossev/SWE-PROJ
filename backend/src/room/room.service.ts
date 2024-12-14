/* eslint-disable prettier/prettier */
// room.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/models/course-schema';
import { Room } from 'src/models/room-schema';
import mongoose, { Model, Types } from 'mongoose';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private readonly userService: UserService,
  ) {}

  // Create a new room for a specific course
  async createRoom(createRoomDto: CreateRoomDto, courseName: string, userId: string): Promise<Room> {
    // Step 1: Find the course by its title (name)
    const course = await this.courseModel.findOne({ title: courseName });
    if (!course) {
      // Instead of a generic error, throw an HTTP exception with 404 status
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
  
    /*// Step 2: Check if the user is enrolled in the course
    const userIsEnrolled = course.students.some(
      (student: mongoose.Types.ObjectId) => student.toString() === userId
    );
    if (!userIsEnrolled) {
      // Throw an HTTP exception with 403 status if user is not enrolled
      throw new HttpException('User is not enrolled in the course', HttpStatus.FORBIDDEN);
    }*/
  
    // Step 3: Create the room with the associated course ObjectId
    const room = new this.roomModel({
      ...createRoomDto,
      course: course._id,  // Reference to the course's ObjectId
    });
  
    // Step 4: Save and return the room
    return room.save();
  }
  async createPrivateRoom(loggedInUserId: Types.ObjectId, createRoomDto: CreateRoomDto, courseId: Types.ObjectId): Promise<Room> {
    // Step 1: Fetch the logged-in user
    const loggedInUser = await this.userService.findById(loggedInUserId.toString());
    if (!loggedInUser) {
      throw new HttpException('Logged-in user not found', HttpStatus.NOT_FOUND);
    }
  
    // Step 2: Ensure that one of the users is an instructor
    const instructor = createRoomDto.instructor;
    if (instructor.toString() !== loggedInUserId.toString() && loggedInUser.role !== 'Instructor') {
      throw new HttpException('Only the instructor can create the room', HttpStatus.FORBIDDEN);
    }
  
    // Step 3: Fetch the course by ID
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
  
    // Step 4: Ensure that the instructor is the one teaching the course
    if (course.instructor.toString() !== instructor.toString()) {
      throw new HttpException('Instructor does not teach this course', HttpStatus.FORBIDDEN);
    }
  
    // Step 5: Ensure both the instructor and the students are enrolled in the course
    const studentIds = createRoomDto.students;
    const allUsersEnrolled = [...studentIds, instructor.toString()].every((userId) =>
      course.students.some((student: Types.ObjectId) => student.toString() === userId)
    );
    if (!allUsersEnrolled) {
      throw new HttpException('All users must be enrolled in the course', HttpStatus.FORBIDDEN);
    }
  
    // Step 6: Generate a private room ID
    const roomId = await this.generatePrivateRoomId(instructor, studentIds[0]);  // Assumes one student for private room creation
  
    // Step 7: Check if the private room already exists
    const existingRoom = await this.roomModel.findOne({ roomId });
    if (existingRoom) {
      throw new HttpException('Private room already exists.', HttpStatus.BAD_REQUEST);
    }
  
    // Step 8: Create the private room using DTO
    const newRoom = new this.roomModel({
      roomId,
      users: [createRoomDto.instructor, ...createRoomDto.students],  // Uses the DTO instructor and students
      isPrivate: true,
      course: courseId,  // Associate the room with the course
      name: createRoomDto.name,  // Use the name from DTO
    });
  
    return newRoom.save();
  }
  async generatePrivateRoomId(userId1: Types.ObjectId, userId2: Types.ObjectId): Promise<string> {
    // Sort user IDs so that the room ID is always the same regardless of the order
    const ids = [userId1.toString(), userId2.toString()];
    ids.sort();
    return ids.join('-'); // Example: 'user1Id-user2Id'
  }
  
  // Get rooms by course ID
  async getRoomsByCourse(courseId: string): Promise<Room[]> {
    return this.roomModel.find({ course: courseId }).populate('users');
  }

  // Get room details by name
  async getRoomByName(roomName: string): Promise<Room> {
    const room = await this.roomModel.findOne({ name: roomName }).populate('users');
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  async checkRoomExists(roomName : string)
  {
    const room = this.roomModel.findOne({name : roomName});
    if(room)
    {
      return true;
    }

    return false;
  }

  /*async joinRoom(userId : string  , roomName : string)
  {
    const room = await this.roomModel.findOne({name : roomName});
    room.user_id.push(new Types.ObjectId(userId));
    return {"Success" : true};
  }*/

  // Mark room as inactive
  async setRoomInactive(roomId: string): Promise<Room> {
    return this.roomModel.findByIdAndUpdate(roomId, { active: false }, { new: true });
  }

  async joinRoom(roomName : string , id: string)
  {
    const room = await this.roomModel.findOne({name : roomName});
    room.user_id.push(new Types.ObjectId(id));
    return await room.save();
  }

  async leaveRoom(roomName : string , id: string)
  {
    let room = await this.roomModel.findOne({name : roomName});
    room.user_id = room.user_id.filter(x => x.toString() !== id);
    return await room.save();
  }
  

}
