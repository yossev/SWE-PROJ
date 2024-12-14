/* eslint-disable prettier/prettier */
import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User ,UserDocument } from 'models/user-schema';
import updateUserDto from './dto/updateUser.dto';
// import { Course } from 'src/models/course-schema';
import { Model, Types } from 'mongoose';
import { createUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
 import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { CourseDocument } from 'models/course-schema';
import { AuthService } from 'src/auth/auth.service';
import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';
import { Response } from 'express';
import { ProgressService } from 'src/progress/progress.service';
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
      // Login existing user


  /*async login(loginDto: LoginDto, res: Response) {
    console.log('Logging in');
     const { email, password } = loginDto;

       // 1. Find the user by email
     const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('User not found');
     }
     const id=user._id;

     // 2. Check if the password is correct
     const isPasswordValid = await bcrypt.compare(password, user.password_hash);
     if (!isPasswordValid) {
       throw new UnauthorizedException('Invalid credentials');
     }

     // 3. Generate tokens
      const accessToken = this.jwtService.sign(
        { email: user.email, userId: user._id },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      );
      console.log('entering refresh token');
      const refreshToken = await this.authService.generateRefreshToken(user._id.toString());
      console.log('finshing refresh token');
    // 4. Set tokens as cookies
    res.cookie('AccessToken', accessToken, {
       httpOnly: true,
        //secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 60 * 60 * 1000, // 1 hour
     });
     console.log('finished first');
    res.cookie('RefreshToken', refreshToken, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
console.log('finished cookies');
    // 5. Return response (if needed)
      return { message: 'Login successful', userId: id };
    }*/

      async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
      }
      
      async findByName(name: string): Promise<User> {
        return await this.userModel.findOne({ name, role: 'instructor' }); // Filter by role
      }
      
      async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec(); // Ensure `_id` is included (default behavior)
      }
     async findAllInstructors(): Promise<User[]> {
      return await this.userModel.find({ role: 'instructor' }).exec();
    }
    async findAllByRole(role: string): Promise<User[]> {
      return await this.userModel.find({ role }).exec();
    }
    
    
    // instructor or admin Get all students
    async findStudentsByInstructor(instructorId: string): Promise<User[]> {
      if (!Types.ObjectId.isValid(instructorId)) {
        throw new BadRequestException('Invalid instructor ID');
      }
    
      const validInstructorId = new Types.ObjectId(instructorId);
    
      // Find courses taught by this instructor
      const courses = await this.courseModel.find({ instructor: validInstructorId }).exec();
      if (courses.length === 0) {
        return []; // Return an empty list if the instructor has no courses
      }
    
      const courseIds = courses.map((course) => course._id); // Extract course IDs
    
      // Find students enrolled in these courses
      return await this.userModel.find({ role: 'student', course: { $in: courseIds } }).exec();
    }
    
    
    
  
    // will register
    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({ email });
        if (user) {
          throw new BadRequestException('Email must be unique.');
        }
      }
    
    
    // Get a student by ID malhash lazma
    async findById(id: string): Promise<User> {
        console.log(id)
        const student=  await this.userModel.findById(id);  // Fetch a student by ID
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
    
     
   /* async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
      const userId = await this.authService.findRefreshToken(
        refreshAccessTokenDto.refreshToken
      );
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException('Bad request');
      }
      return {
        accessToken: await this.authService.createAccessToken(user._id.toString()),
      };
    }*/
    async logout(res: Response) {
      res.clearCookie('AccessToken');
      res.clearCookie('RefreshToken');
      return { message: 'Logout successful' };
    }
}

  
    
// ngebha men courses
    // async findAllCourses(): Promise<Course[]> {
    //     return await this.courseModel.find(); // Fetch all courses
    // }
    // async findEnrolledCourses(): Promise<Course[]> {
    //     return await this.courseModel.find(); // Fetch all courses
    // }









    // async login(req: Request, loginDto: LoginDto): Promise<{ user: User, jwtToken: string, refreshToken: string }> {
    //     const user = await this.findByEmail(loginDto.email);
    //     await this.checkPassword(loginDto.password, user.password_hash);
    
    //     const result = {
    //       user,
    //       jwtToken: await this.authService.createAccessToken(user._id.toString()),
    //       refreshToken: await this.authService.createRefreshToken(req, user._id),
    //     };
    
    //     return result;
    //   }
    //   async checkPassword(password: string, hashPassword: string) {
    //     const match = await bcrypt.compare(password, hashPassword);
    //     if (!match) {
    //       throw new UnauthorizedException('Wrong email or password.');
    //     }
    //   }
    //   async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    //     const userId = await this.authService.findRefreshToken(
    //       refreshAccessTokenDto.refreshToken,
    //     );
    //     const user = await this.userModel.findById(userId);
    //     if (!user) {
    //       throw new BadRequestException('Bad request');
    //     }
    //     return {
    //       accessToken: await this.authService.createAccessToken(user._id),
    //     };
    //   }


