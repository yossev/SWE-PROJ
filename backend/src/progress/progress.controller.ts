import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress, ProgressDocument } from '../../models/progress-schema';
import { CreateProgressDTO } from './dto/createProgress.dto'; 
import { UpdateProgressDTO } from './dto/updateProgress.dto';  

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    // Create a new progress record
    @Post()
    async create(@Body() progressData: CreateProgressDTO): Promise<Progress> {
        return this.progressService.create(progressData);
    }
    // Get dashboard
    @Get('dashboard/:userId/:courseId')
    async getDashboard(@Param('userId') userId: string, @Param('courseId') courseId: string) {
      return await this.progressService.getDashboard(userId);
    }
    
    // Get all progress records
    @Get()
    async findAll(): Promise<Progress[]> {
        return this.progressService.findAll();
    }

    // Get a specific progress record by ID
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Progress> {
        return this.progressService.findOne(id);
    }

    // Update a specific progress record by ID
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() progressData: UpdateProgressDTO,
    ): Promise<Progress> {
        return this.progressService.update(id, progressData);
    }

    // Delete a specific progress record by ID
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.progressService.delete(id);
    }

    @Get('completed/:userId')
    async getCompletedCourses(@Param('userId') userId: string) {
        return await this.progressService.getCompletedCourses(userId);
    }

}
