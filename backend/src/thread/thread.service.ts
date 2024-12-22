/* eslint-disable prettier/prettier */
import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Thread, ThreadDocument } from "../models/thread-schema";
import { Model, Types } from "mongoose";
import { CreateThreadDto } from "./dto/createThread.dto";
import { SearchThreadDto } from "./dto/searchThread.dto";
import { UpdateThreadDto } from "./dto/updateThread.dto";

import { ForumService } from "src/forum/forum.service";
import { CourseService } from "src/course/course.service";
import { NotificationService } from "src/notification/notification.service";
import { Reply } from "../models/reply-schema";


@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    @InjectModel(Reply.name) private replyModel: Model<ThreadDocument>,
    private readonly forumService : ForumService,
    private readonly courseService :CourseService,
    private readonly notificationService :NotificationService
  ) {}

  // Create a new thread in a folder
  async createThread(@Req() req,createThreadDto: CreateThreadDto) {
    createThreadDto.createdBy=req.cookies.userId;
    const forum=this.forumService.getForumById(createThreadDto.forum_id.toString());
    const forumTitle=(await forum).forumTitle;
    const course=this.courseService.findOne((await forum).course_id.toString());
    const users=(await course).students;
    const message = `A new thread "${createThreadDto.threadTitle} has been added to the forum "${forumTitle}" with the content "${createThreadDto.content}`;
    this.notificationService.createNotification(users,message);
    return await this.threadModel.create(createThreadDto);
  }

  async search(searchThreadDto : SearchThreadDto)
  {
    const threads = await this.threadModel.find(searchThreadDto);
    return threads;
  }

  async updateMyThread(@Req() req, updateThreadDto: UpdateThreadDto): Promise<Thread> {
    const loggedinuser = req.cookies.userId; // Get the logged-in user ID
    const threadId = updateThreadDto.thread_id;
  
    // Find the thread document
    const thread = await this.threadModel.findById(threadId);

  
    // Check if the logged-in user is the creator of the thread
    if (thread.createdBy.toString() !== loggedinuser) {
      throw new UnauthorizedException("You are not authorized to update this thread");
    }
  
    // Update only the allowed fields (threadTitle, content, forum_id)
    const { threadTitle, content} = updateThreadDto;
  
    if (threadTitle) thread.threadTitle = threadTitle;
    if (content) thread.content = content;
  
  
    // Save the updated document
    await thread.save();
  
    return thread;
  }
  

  async searchThreadsByKeyword(keyword: string): Promise<Thread[]> {
    return this.threadModel
      .find({
        $text: { $search: keyword }, // MongoDB text search
      })
      .exec();
  }

  async getThreadReplies(threadId: string) {
    
    /*if (!Types.ObjectId.isValid(threadId)) {
      throw new Error('Invalid thread ID');
    }*/

    return await this.replyModel.find({ thread_id: threadId }).exec();
  }

  async getAllThreads(userId: string ) {
    const threads = await this.threadModel.find({ createdBy: userId }).exec();
    return threads;
  }

  async deleteThread(userId : string , threadId : string)
  {
    const thread = await this.threadModel.findById(new Types.ObjectId(threadId)).exec();
    if(thread.createdBy.toString()===userId)
    {
      return await this.threadModel.findByIdAndDelete(new Types.ObjectId(threadId));
    }
    else
    {
      const forum=await this.forumService.getForumById(thread.forum_id.toString());
      const course=await this.courseService.findOne((await forum).course_id.toString());
      const instructorId = course.created_by;
      if(instructorId.toString()===userId)
        {
          return await this.threadModel.findByIdAndDelete(new Types.ObjectId(threadId));
        }
      else
        {
          throw new Error("You are not authorized to delete this thread");
        }
    }
  }
  async getThreadsByForumId(forumId: string): Promise<Thread[]> {
    return this.threadModel
      .find({ forum_id: new Types.ObjectId(forumId) }) // Populate createdBy with user details (e.g., name)
      .exec();
  }

}
