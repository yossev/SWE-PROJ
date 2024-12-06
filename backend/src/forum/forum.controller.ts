/* eslint-disable prettier/prettier */

import { Controller, Post, Body, Get, Delete, Query } from "@nestjs/common";
import { CreateReplyDto } from "src/reply/dto/createReply.dto";
//import { CreateThreadDto } from "src/thread/dto/createThread.dto";
import { ForumService } from "./forum.service";
import { Roles, Role } from "src/auth/decorators/roles.decorator";
import { CreateForumDto } from "./dto/createForum.dto";


@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  // Endpoint to get all forums
  @Roles(Role.Instructor, Role.User)  // Allow both Instructor and Student to view forums
  @Get()
  async getForums() {
    return this.forumService.getForums();
  }

  @Delete('delete')
  async deleteForum(@Query('id') id: string , @Query('creatorId') creatorId : string)
  {
    return this.forumService.deleteForum(id , creatorId);
  }



  // Endpoint to create a forum (Restricted to Instructor role)
  @Roles(Role.Instructor)
  @Post('create')
  async createForum(@Body() createForumDto : CreateForumDto) {
    return this.forumService.createForum(createForumDto);
  }

}
