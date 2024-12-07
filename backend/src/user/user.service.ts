/* eslint-disable prettier/prettier */
import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument  } from 'src/models/user-schema';
import updateUserDto from './dto/updateUser.dto';
// import { Course } from 'src/models/course-schema';
import { Model } from 'mongoose';
import { createUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
 import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { AuthService } from 'src/auth/auth.service';
import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';
import { Course, CourseDocument } from 'models/course-schema';
// import { LoginDto } from './dto/loginDto.dto';
// import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';

@Injectable()
export class UserService {

    constructor(
     
        private readonly jwtService: JwtService, 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel('Course') private courseModel: Model<CourseDocument>,
        //@Inject(forwardRef(() => AuthService))
        //private readonly authService: AuthService
    ) { }
   
   async register(createUserDto:createUserDto): Promise<User> {
    console.log('Registering user:', createUserDto);
        const user = new this.userModel(createUserDto);  // Create a new student document
        await this.isEmailUnique(createUserDto.email);
        return await user.save();  // Save it to the database
    }
      // Login existing user
      async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
    
        // 1. Find the user by email
        const user = await this.userModel.findOne({ email });
        const userId = user._id;
        // 2. Check if the user exists
        if (!user) {
          throw new UnauthorizedException('user invalid');
        }
    
        // 3. Check if the password is correct (e.g., using bcrypt to compare the hashed password)
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        console.log('loginDto.password:', loginDto.password);
        console.log('user.password (hashed):', user.password_hash);
  
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
           // Generate JWT token
    const token = this.jwtService.sign(
      { email: user.email, userId: user._id },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );  // Secret key from environment variable


      console.log("Returner control");
        return { token , userId }; // Return the token to the client
      }
      async findByName(username: string): Promise<User> {
        return await this.userModel.findOne({ username, role: 'instructor' }); // Filter by role
      }
      
    async findByEmail(email: string):Promise<User> { // instructor malhas
        const user=await this.userModel.findOne({email})
        return user;  // Fetch a student by username
    }
    // instructor or admin Get all students
    async findAll(role?: string, instructorId?: string): Promise<User[]> {
      let filter = {};
    
      if (role === 'student') {
        // Students should see all instructors
        filter = { role: 'instructor' };
      } else if (role === 'instructor' && instructorId) {
        if (role === 'instructor' && instructorId) {
          const courses = await this.courseModel.find({ instructor: instructorId });
          const courseIds = courses.map(course => course._id);
          filter = { role: 'student', course: { $in: courseIds } };
        }
        // Instructors should see students in their courses
        // Assuming "courseInstructor" is a field in the "students" user model
        filter = { role: 'student', courseInstructor: instructorId };
      } else {
        // Optional: Handle other cases if needed or throw an error
        throw new Error('Invalid role or missing instructor ID');
      }
    
      return await this.userModel.find(filter).exec(); // Execute the query
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
     /*
    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
      const userId = await this.authService.findRefreshToken(
        refreshAccessTokenDto.refreshToken,
      );
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException('Bad request');
      }
      return {
        accessToken: await this.authService.createAccessToken(user._id.toString()),
      };
    }
      */

  
    
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

}