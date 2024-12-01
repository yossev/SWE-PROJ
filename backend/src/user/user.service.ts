/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User  } from 'models/user-schema';
import updateUserDto from './dto/updateUser.dto';
import { Course } from 'models/course-schema';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
    courseModel: mongoose.Model<Course>;
    constructor(
        @InjectModel(User.name) private userModel: mongoose.Model<User>
    ) { }

    async create(studentData: User): Promise<User> {
        const newStudent = new this.userModel(studentData);  // Create a new student document
        const user=  await newStudent.save()
        return user;  // Save it to the database
    }
    async findByName(username: string):Promise<User> {
        return await this.userModel.findOne({username});  // Fetch a student by username
    }
    async findByEmail(email: string):Promise<User> {
        const user=await this.userModel.findOne({email})
        return user;  // Fetch a student by username
    }
    // Get all students
    async findAll(): Promise<User[]> {
        const students = await this.userModel.find(); // Fetch all students from the database
        console.log(students);
        return students;
    }
    

    // Get a student by ID
    async findById(id: string): Promise<User> {
        console.log(id)
        const student=  await this.userModel.findById(id);  // Fetch a student by ID
        return student
    }

    // Update a student's details by ID
    async update(id: string, updateData: updateUserDto): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, updateData, { new: true });  // Find and update the student
    }
    // Delete a student by ID
    async delete(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id);  // Find and delete the student
    }
// ngebha men courses
    async findAllCourses(): Promise<Course[]> {
        return await this.courseModel.find(); // Fetch all courses
    }
    async findEnrolledCourses(): Promise<Course[]> {
        return await this.courseModel.find(); // Fetch all courses
    }
    

}