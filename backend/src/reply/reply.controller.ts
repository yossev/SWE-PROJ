/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/createReply.dto';

import { UpdateReplyDto } from './dto/updateReply.dto';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guards';


@Controller('Reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}

   @Roles(Role.Instructor,Role.Student)
  @UseGuards(authorizationGuard)
  @Post('create')
  async createReply(@Req() req,@Body() createReplyDto : CreateReplyDto) {
    return this.replyService.createReply(req,createReplyDto);
  }
  @Roles(Role.Instructor,Role.Student)
  @UseGuards(authorizationGuard)
  @Put('update')
      async updateReply(@Body() UpdateReplyDto: UpdateReplyDto) {
         return this.replyService.updateReply(UpdateReplyDto);
      }
      @Roles(Role.Instructor,Role.Student)
      @UseGuards(authorizationGuard)
  @Delete('delete')
      async deleteReply(@Query('id') id: string) {
          return this.replyService.deleteReply(id);
      }
}