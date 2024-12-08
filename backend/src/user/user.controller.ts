/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/models/user-schema';
import * as bcrypt from 'bcrypt';

import { createUserDto } from './dto/createUser.dto';
import updateUserDto from './dto/updateUser.dto';

import { AuthGuard } from '../auth/guards/authentication.guards';
import { Public } from '../auth/decorators/public.decorator';

import { Role, Roles } from '../auth/decorators/roles.decorator';
import { authorizationGuard } from '../auth/guards/authorization.guards';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';
import { ProgressService } from 'src/progress/progress.service';

// @UseGuards(AuthGuard) //class level
@Controller('users') // it means anything starts with /student
export class UserController {
    constructor(private userService: UserService,private readonly progressService: ProgressService) { }
    @Get('/all') 
    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(AuthGuard)
    // Get all students
    async getAllStudents(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Roles(Role.Instructor, Role.Admin)
    @UseGuards(authorizationGuard)
    @Get(':id')// /student/:id
    // Get a single student by ID
    async getUserById(@Param('id') id: string):Promise<User> {// Get the student ID from the route parameters
        const user = await this.userService.findById(id);
        return user;
    }

    //Create a new student
    @Public()
    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
         return this.userService.login(loginDto);
     }
    @Public()
    @Post('/register')
    async register(@Body()userData: createUserDto) {// Get the new student data from the request body

        // Hash the password before saving
        const passwordHash = await bcrypt.hash(userData.password_hash, 10);
        userData.password_hash=passwordHash;
        
       const newUser = await this.userService.register(userData);
       return newUser;
    }
    // Update a student's details
   
    @Put('me')
    async updateUserProfile(@Req() req, @Body() updateData: updateUserDto) {
        console.log("entered function");
        const userId = req.cookies['userId']; // Extract logged-in user's ID from request
        console.log("userId is: " , userId);
        return await this.userService.update(userId, updateData);
    }
    
    // Delete a student by ID
    @Delete(':id')
    async deleteUser(@Param('id')id:string) {
        const deletedUser = await this.userService.delete(id);
       return deletedUser;
    }
    @Get('completed/:userId')
  async getCompletedCourses(@Param('userId') userId: string) {
    return await this.progressService.getCompletedCourses(userId);
  }
    /*
    @Post('token/refresh')
  @HttpCode(HttpStatus.CREATED)
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    try {
      return await this.userService.refreshAccessToken(refreshAccessTokenDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
    */
    // @Get('courses')
    // async getAllCourses() {
    //     return await this.userService.findAllCourses();
    // }
}