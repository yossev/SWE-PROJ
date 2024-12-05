/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

//import { CreateFolderDto } from 'src/folder/dto/createFolder.dto';
import { CreateReplyDto } from 'src/reply/dto/createReply.dto';
import { CreateForumDto } from './dto/createForum.dto';
import { create } from 'domain';
import { Forum } from 'models/forum-schema';
import { Reply } from 'models/reply-schema';
import { Thread } from 'models/thread-schema';
import { Topic } from 'models/topic-schema';
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

}
