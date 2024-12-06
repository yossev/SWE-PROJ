/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/models/user-schema';
import * as bcrypt from 'bcrypt';

import { createUserDto } from './dto/createUser.dto';
import updateUserDto from './dto/updateUser.dto';

import { JwtAuthGuard } from '../auth/guards/jwtAuthGuard.guard';
import { AuthGuard } from '../auth/guards/authentication.guards';
import { Public } from '../auth/decorators/public.decorator';

import { Role, Roles } from '../auth/decorators/roles.decorator';
import { authorizationGuard } from '../auth/guards/authorization.guards';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';



// @UseGuards(AuthGuard) //class level
@Controller('users') // it means anything starts with /student
export class UserController {
    constructor(private userService: UserService) { }
    @Get('/all') 
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Instructor, Role.Admin)
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
        const userId = req.user.userId; // Extract logged-in user's ID from request
        return await this.userService.update(userId, updateData);
    }
    
    // Delete a student by ID
    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Delete(':id')
    async deleteUser(@Param('id')id:string) {
        const deletedUser = await this.userService.delete(id);
       return deletedUser;
    }
    
    // @Get('courses')
    // async getAllCourses() {
    //     return await this.userService.findAllCourses();
    // }
}