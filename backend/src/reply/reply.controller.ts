/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Post, Put, Query, Req } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/createReply.dto';
import { UpdateThreadDto } from 'src/thread/dto/updateThread.dto';
import { UpdateReplyDto } from './dto/updateReply.dto';


@Controller('Reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}
 
  @Post('create')
  async createReply(@Req() req,@Body() createReplyDto : CreateReplyDto) {
    return this.replyService.createReply(req,createReplyDto);
  }
  @Put('update')
      async updateReply(@Body() UpdateReplyDto: UpdateReplyDto) {
          return this.replyService.updateReply(UpdateReplyDto);
      }
  @Delete('delete')
      async deleteReply(@Query('id') id: string) {
          return this.replyService.deleteReply(id);
      }
}
