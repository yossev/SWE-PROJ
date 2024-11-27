import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress, ProgressDocument } from '../../models/progress-schema';
import { CreateProgressDTO } from './createProgress.dto'; 
import { UpdateProgressDTO } from './updateProgress.dto';  

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    // Create a new progress record
    @Post()
    async create(@Body() progressData: CreateProgressDTO): Promise<Progress> {
        return this.progressService.create(progressData);
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

}
