/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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


// @UseGuards(AuthGuard) //class level
@Controller('users') // it means anything starts with /student
export class UserController {
    constructor(private userService: UserService) { }n
    @Public()
    @Get() 
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    // Get all students
    async getAllStudents(): Promise<User[]> {
        return await this.userService.findAll();
    }
    @Roles(Role.Instructor)
    @UseGuards(AuthGuard)// handler level
    @Get('currentUser')
    async getCurrentUser(@Req() {user}): Promise<User> {
        const student = await this.userService.findById(user.userid);
        console.log(student)
        return student;
    }


    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    @Get(':id')// /student/:id
    // Get a single student by ID
    async getUserById(@Param('id') id: string):Promise<User> {// Get the student ID from the route parameters
        const user = await this.userService.findById(id);
        return user;
    }
    // Create a new student
    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Post()
    async createUser(@Body()userData: createUserDto) {// Get the new student data from the request body
        const userId = new mongoose.Types.ObjectId().toString();

        // Hash the password before saving
        const passwordHash = await bcrypt.hash(userData.password_hash, 10);
        userData.password_hash=passwordHash;
        userData.user_id=userId;
       // const newUser = await this.userService.create(userData);
     //   return newUser;
    }
    // Update a student's details
    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateData: updateUserDto
    ) {
        return await this.userService.update(id, updateData);
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