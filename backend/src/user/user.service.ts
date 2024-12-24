/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BadRequestException, forwardRef, Inject, Injectable, Req, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';


import updateUserDto from './dto/updateUser.dto';
// import { Course } from '../models/course-schema';
import { Model, Types } from 'mongoose';
import { createUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
 import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

import { AuthService } from 'src/auth/auth.service';
import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';
import { Response } from 'express';
import { ProgressService } from 'src/progress/progress.service';
import { CourseDocument } from '../models/course-schema';
import { User, UserDocument } from '../models/user-schema';
// import { LoginDto } from './dto/loginDto.dto';
// import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';

@Injectable()
export class UserService {

    constructor(
        private readonly jwtService: JwtService, 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel('Course') private courseModel: Model<CourseDocument>,
        private readonly progressService: ProgressService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) { }
   
    async create(userData: User): Promise<UserDocument> {
      const newUser = new this.userModel(userData);  // Create a new student document
      const user=  await newUser.save()
      return user;  // Save it to the database
  }
    

      async findAll(): Promise<UserDocument[]> {
        return await this.userModel.find({role: { $in: ['student', 'instructor'] }}).exec();
      }
      
      async findByName(name: string): Promise<User[]> {
        // Searching for users by name (case-insensitive)
        
        return await this.userModel.find({ name: { $regex: new RegExp(name, 'i') } });
      }
      
      
      
      async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }); // Ensure `_id` is included (default behavior)
      }
      async findStudentByEmail(email: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
          throw new BadRequestException('User not found');
        }
        if (user.role !== 'student') {
          throw new BadRequestException('User is not a student');
        }
        return user;
      }
      
     async findAllInstructors(): Promise<User[]> {
      return await this.userModel.find({ role: 'instructor' }).exec();
    }
    async findAllByRole(role: string): Promise<User[]> {
      return await this.userModel.find({ role }).exec();
    }
    
    
    // instructor or admin Get all students
    async findStudentsByInstructor(instructorId: string): Promise<User[]> { 
      try {
        const instructor=this.userModel.findById(instructorId);
        const courses = await this.courseModel.find({ instructor: instructorId }).exec();
        if (courses.length === 0) {
          return []; // Return an empty list if the instructor has no courses
        }
    
        const courseIds = courses.map((course) => course._id); // Extract course IDs
      
        // Find students enrolled in these courses
        return await this.userModel.find({ role: 'student', course: { $in: courseIds } }).exec();
        } catch (error) {
          console.error('Token verification failed:', error);
          throw new UnauthorizedException('Instructor invalid ');
    }}
    
    
    
    // Get a student by ID malhash lazma
    async findById(id: string): Promise<User> {
      console.log("User ID in fetch is: " + id);
        const student=  await this.userModel.findById(new Types.ObjectId(id));  // Fetch a student by ID
        return student
    }

    // Update a user's details by ID 
    async update(id: string, updateData: updateUserDto): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, updateData, { new: true });  // Find and update the student
    }
    
    // Delete a user  by ID admin bas aw user y delete his account
    async delete(currentUserId: string): Promise<User> {
      // Proceed with deleting the user
      const deletedUser = await this.userModel.findByIdAndDelete(currentUserId);
  
      if (!deletedUser) {
        throw new UnauthorizedException('User not found or deletion failed');
      }
  
      return deletedUser;
     }
    
    

    async logout(res: Response):Promise<any> {
      res.clearCookie('token');
      res.clearCookie('RefreshToken');
      res.clearCookie('jwt');
      return res.status(200).send({ message: 'Logout successful' });
      
   
    }
    async getMyCourses(@Req() req): Promise<any> {
      const userId = req.cookies.userId;
      const user = await this.userModel.findById(userId);
      return user.courses;
    }
    async getStudentCourses(userId: string): Promise<any> {
      const user = await this.userModel.findById(userId);
      return user.courses;
    }
}

  


