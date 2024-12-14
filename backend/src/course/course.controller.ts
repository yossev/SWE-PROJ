/* eslint-disable prettier/prettier */
// SWE-PROJ/backend/src/course/course.controller.ts
import { Controller, Get, Post, Body, Put, Param, Query, Delete, UseGuards, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/createCourse.dto'; 
import { UpdateCourseDto } from './dto/updateCourse.dto'; 
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guards';
import { AuthGuard } from 'src/auth/guards/authentication.guards';

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Post('create')
    create(@Req() req,@Body() createCourseDto: CreateCourseDto) {
        console.log('Creating course:', createCourseDto);
        return this.courseService.create(createCourseDto, req);
    }

    @Get()
    findAll() {
        return this.courseService.findAll();
    }
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
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
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.courseService.update(id, updateCourseDto);
    }
    @UseGuards(AuthGuard)
    @Put('enroll/:id')
    enroll(@Param('id') id: string, @Req() req) {
        this.courseService.enroll(id,req);
    }
}
