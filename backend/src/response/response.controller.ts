import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Responses, ResponseSchema, ResponsesDocument } from '../../models/responses-schema';
import { CreateResponseDto } from './dto/createResponse.dto'; 
import { UpdateResponseDto  } from './dto/updateResponse.dto';  

@Controller('response')
export class ResponseController {
    constructor(private readonly responseService: ResponseService) { }

    // Create a new response record
    @Post()
    async create(@Body() responseData: CreateResponseDto): Promise<Responses> {
        return this.responseService.create(responseData);
    }
    
    // Get all response records
    @Get()
    async findAll(): Promise<Responses[]> {
        return this.responseService.findAll();
    }

    // Get a specific response record by ID
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Responses> {
        return this.responseService.findOne(id);
    }

    // Update a specific response record by ID
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() responseData: UpdateResponseDto,
    ): Promise<Responses> {
        return this.responseService.update(id, responseData);
    }

    // Delete a specific response record by ID
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.responseService.delete(id);
    }

}
