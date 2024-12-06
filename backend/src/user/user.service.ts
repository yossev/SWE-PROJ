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
        private jwtService: JwtService, 
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

    // Find user by email
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }
    async findByName(username: string):Promise<User> {
        return await this.userModel.findOne({username});  // Fetch a instructor by username
    }
    async findByEmail(email: string):Promise<User> { // instructor
        const user=await this.userModel.findOne({email})
        return user;  // Fetch a student by username
    }
    // instructor or admin Get all students
    async findAll(): Promise<User[]> {
        const students = await this.userModel.find(); // Fetch all students from the database
        console.log(students);
        return students;
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