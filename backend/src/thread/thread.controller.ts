/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Body, Query, Delete, Req} from '@nestjs/common';
import { CreateThreadDto } from './dto/createThread.dto';
import { UpdateThreadDto } from './dto/updateThread.dto';
import { ThreadService } from './thread.service';


@Controller('threads')
export class ThreadController {
    constructor(private readonly threadService: ThreadService) {}

    @Post('create')
    async createThread(@Req() req,@Body() createThreadDto: CreateThreadDto) {
        return this.threadService.createThread(req,createThreadDto);
    }

    @Put('update/:id')
    async updateThread(@Req() req,@Body() updateThreadDto: UpdateThreadDto) {
        return this.threadService.updateMyThread(req,updateThreadDto);
    }

    @Get('search')
    async searchThreads(@Query('keyword') keyword: string) {
        return this.threadService.searchThreadsByKeyword(keyword);
    }

    @Delete('delete')
    async deleteThread(@Query('id') id: string) {
        return this.threadService.deleteThread(id);
    }
    @Get('getReplies')
    async getReplies(@Query('id') id: string )
    {
    return this.threadService.getThreadReplies(id);
    }
}
