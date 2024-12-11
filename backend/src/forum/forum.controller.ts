/* eslint-disable prettier/prettier */

import { Controller, Post, Body, Get, Delete, Query } from "@nestjs/common";
import { CreateReplyDto } from "src/reply/dto/createReply.dto";
//import { CreateThreadDto } from "src/thread/dto/createThread.dto";
import { ForumService } from "./forum.service";

import { CreateForumDto } from "./dto/createForum.dto";
import { Roles,Role } from "src/auth/decorators/roles.decorator";


@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  // Endpoint to get all forums
  @Roles(Role.Instructor, Role.Student)  // Allow both Instructor and Student to view forums
  @Get()
  async getForums() {
    return this.forumService.getForums();
  }

  @Delete('delete')
  async deleteForum(@Query('id') id: string , @Query('creatorId') creatorId : string)
  {
    return this.forumService.deleteForum(id , creatorId);
  }

  /*
  // Endpoint to create a folder (Restricted to Instructor role)
  @Roles(Role.Instructor)
  @Post('folder')
  async createFolder(@Body() createFolderDto: CreateFolderDto) {
    return this.forumService.createFolder(createFolderDto);
  }
    */

  /*
  // Endpoint to create a thread (Restricted to Instructor and Student roles)
  @Roles(Role.Instructor, Role.Student)
  @Post('thread')
  async createThread(@Body() createThreadDto: CreateThreadDto) {
    return this.forumService.createThread(createThreadDto);
  }
    */

  // Endpoint to create a reply (Restricted to Instructor and Student roles)
  @Roles(Role.Instructor, Role.Student)
  @Post('reply')
  async createReply(@Body() createReplyDto: CreateReplyDto) {
    return this.forumService.createReply(createReplyDto);
  }

  // Endpoint to create a forum (Restricted to Instructor role)
  @Roles(Role.Instructor)
  @Post('create')
  async createForum(@Body() createForumDto : CreateForumDto) {
    return this.forumService.createForum(createForumDto);
  }

  // Endpoint to update a thread (Restricted to Instructor role)

  // Endpoint to search threads by folder name (Accessible to all roles)
  /*
  @Roles(Role.Instructor, Role.Student)
  @Get('threads/search')
  async searchThreadByFolderName(@Body('folderName') folderName: string) {
    return this.forumService.searchThreadByFolderName(folderName);
  }
  */
}
