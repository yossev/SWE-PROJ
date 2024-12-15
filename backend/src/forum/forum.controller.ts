/* eslint-disable prettier/prettier */

import { Controller, Post, Body, Get, Delete, Query, Req, UseGuards } from "@nestjs/common";
import { CreateReplyDto } from "src/reply/dto/createReply.dto";
//import { CreateThreadDto } from "src/thread/dto/createThread.dto";
import { ForumService } from "./forum.service";
import { Roles, Role } from "src/auth/decorators/roles.decorator";
import { CreateForumDto } from "./dto/createForum.dto";
import { authorizationGuard } from "src/auth/guards/authorization.guards";


@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}
// Endpoint to create a forum (Restricted to Instructor role)
@Roles(Role.Instructor)
@UseGuards(authorizationGuard)
@Post('create')
createForum(@Req() req,@Body() createForumDto : CreateForumDto) {
  return this.forumService.create(req,createForumDto);
}
// Endpoint to get all forums
@Roles(Role.Instructor, Role.Student)  // Allow both Instructor and Student to view forums
@UseGuards(authorizationGuard)
@Get()
async getForums() {
  return this.forumService.getForums();
}
@Roles(Role.Instructor)
@UseGuards(authorizationGuard)
@Delete('delete')
async deleteForum(@Query('id') id: string , @Query('creatorId') creatorId : string)
{
  return this.forumService.deleteForum(id , creatorId);
}
@Get('getThreads')
async getThreads(@Query('id') id: string )
{
  return this.forumService.getForumThreads(id);
}
  

}
