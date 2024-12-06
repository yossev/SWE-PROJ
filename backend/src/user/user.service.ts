/* eslint-disable prettier/prettier */
 import { BadRequestException, Injectable, UnauthorizedException, /*UnauthorizedException*/ } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument  } from 'src/models/user-schema';
import updateUserDto from './dto/updateUser.dto';
// import { Course } from 'src/models/course-schema';
import { Model } from 'mongoose';
import { createUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
 import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
// import { LoginDto } from './dto/loginDto.dto';
// import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly jwtService: JwtService, 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }
   
   async register(createUserDto:createUserDto): Promise<User> {
        const user = new this.userModel(createUserDto);  // Create a new student document
        await this.isEmailUnique(createUserDto.email);
        return await user.save();  // Save it to the database
    }
      // Login existing user
      async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
    
        // 1. Find the user by email
        const user = await this.userModel.findOne({ email });
    
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
    
        // 4. Generate a JWT token
        const token = this.jwtService.sign(
          { email: user.email, userId: user._id },  // Data to include in the token
          { secret: process.env.JWT_SECRET },  // Secret key from environment variable
        );
        return { token }; // Return the token to the client
      }
    async findByName(username: string):Promise<User> {
        return await this.userModel.findOne({username});  // Fetch a instructor by username
    }
    async findByEmail(email: string):Promise<User> { // instructor
        const user=await this.userModel.findOne({email})
        return user;  // Fetch a student by username
    }
    // instructor or admin Get all students
    async findAll(role?: string): Promise<User[]> {
      // If a role is provided, filter users by the role
      let filter = {};
      if (role) {
          filter = { role }; // { role: 'student' } or { role: 'instructor' }
      }
  
      // Fetch users from the database based on the filter
      const users = await this.userModel.find(filter);
  
      console.log(users); // Log the fetched users
      return users;
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
    async delete(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id);  // Find and delete the student
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

}