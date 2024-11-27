// SWE-PROJ/backend/src/course/course.controller.ts
import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/createCourse.dto'; 
import { UpdateCourseDto } from './dto/updateCourse.dto'; 

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.courseService.create(createCourseDto);
    }

    @Get()
    findAll() {
        return this.courseService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.courseService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.courseService.update(id, updateCourseDto);
    }
}