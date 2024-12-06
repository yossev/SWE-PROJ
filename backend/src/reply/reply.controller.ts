/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { CreateForumDto } from 'src/forum/dto/createForum.dto';
import { CreateReplyDto } from './dto/createReply.dto';


@Controller('Reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}
  @Roles(Role.User)
  @Post('create')
  async createReply(@Body() createReplyDto : CreateReplyDto) {
    return this.replyService.createReply(createReplyDto);
  }
  
}
