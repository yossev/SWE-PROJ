/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Forum } from 'src/models/forum-schema';
import { Topic } from 'src/models/topic-schema';
import { Thread } from 'src/models/thread-schema'; // Assuming thread schema is defined
import { Reply } from 'src/models/reply-schema'; // Assuming reply schema is defined
//import { CreateFolderDto } from 'src/folder/dto/createFolder.dto';
import { CreateReplyDto } from 'src/reply/dto/createReply.dto';
import { CreateForumDto } from './dto/createForum.dto';
//import { CreateThreadDto } from 'src/thread/dto/createThread.dto';



@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Forum.name) private forumModel: Model<Forum>,
    @InjectModel(Topic.name) private folderModel: Model<Topic>,
    @InjectModel(Thread.name) private threadModel: Model<Thread>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
  ) {}

  // Create a new forum
  async createForum(createForumDto : CreateForumDto) {
    createForumDto.active = true;
    const forum = this.forumModel.create(createForumDto);
    return forum;
  }

  // Get all forums
  async getForums() {
    return this.forumModel.find().exec();
  }

  async deleteForum(forumId: string , instructorId : string)
  {
    const forum = this.forumModel.findById(new Types.ObjectId(forumId)).exec();
    const creatorIdString = ((await forum).createdBy).toString();
    if(creatorIdString === instructorId)
    {
      (await forum).active = false;
      return (await forum).save();
    }
    else
    {
      return { "Message" : "You are not the creator of this forum."}
    }

  }

  /*
  // Create a new folder in the forum
  async createFolder(createFolderDto: CreateFolderDto) {
    const forum = await this.forumModel.findById(createFolderDto.forumId);
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const folder = new this.folderModel(createFolderDto);
    return folder.save();
  }
  */

  /*
  // Create a new thread in a folder
  async createThread(createThreadDto: CreateThreadDto) {
    const forum = await this.forumModel.findById(createThreadDto.forumId);
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const thread = new this.threadModel(createThreadDto);
    return thread.save();
  }
    */

  // Create a reply in a thread
  async createReply(createReplyDto: CreateReplyDto) {
    const thread = await this.threadModel.findById(createReplyDto.threadId);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    const reply = new this.replyModel(createReplyDto);
    return reply.save();
  }
}
