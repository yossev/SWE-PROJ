/* eslint-disable prettier/prettier */
// SWE-PROJ/backend/src/course/course.controller.ts
/*import { Controller, Get, Post, Body, Put, Param, Query, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/createCourse.dto'; 
import { UpdateCourseDto } from './dto/updateCourse.dto'; 

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
        console.log('Creating course:', createCourseDto);
        return this.courseService.create(createCourseDto);
    }

    @Get()
    findAll() {
        return this.courseService.findAll();
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        return this.courseService.delete(id);
    }

    @Get('search')
    search(@Query('query') query: string){
        console.log('Search Query: ', query)
        return this.courseService.search(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.courseService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.courseService.update(id, updateCourseDto);
    }
}*/
