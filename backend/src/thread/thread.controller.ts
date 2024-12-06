/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Param, Body, Query, Delete } from '@nestjs/common';
import { CreateThreadDto } from './dto/createThread.dto';
import { SearchThreadDto } from './dto/searchThread.dto';
import { UpdateThreadDto } from './dto/updateThread.dto';
import { ThreadService } from './thread.service';


@Controller('threads')
export class ThreadController {
    constructor(private readonly threadService: ThreadService) {}

    @Post('create')
    async createThread(@Body() createThreadDto : CreateThreadDto)
    {
        return this.threadService.createThread(createThreadDto);
    }

    @Put('update')
    async updateThread(@Body() updateThreadDto : UpdateThreadDto)
    {
        return this.threadService.updateThread(updateThreadDto);
    }

    @Get('search')
    async findTopicsById(@Body() searchThreadDto : SearchThreadDto)
    {
        return this.threadService.search(searchThreadDto);
    }
    @Delete('delete')
    async deleteThread(@Query('id') id:string)
    {
        return this.threadService.deleteThread(id);
    }
}