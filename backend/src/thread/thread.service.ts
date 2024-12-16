/* eslint-disable prettier/prettier */
import { Injectable, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Thread, ThreadDocument } from "src/models/thread-schema";
import { Model, Types } from "mongoose";
import { CreateThreadDto } from "./dto/createThread.dto";
import { SearchThreadDto } from "./dto/searchThread.dto";
import { UpdateThreadDto } from "./dto/updateThread.dto";
import { Reply } from "models/reply-schema";
import { ForumService } from "src/forum/forum.service";
import { CourseService } from "src/course/course.service";
import { NotificationService } from "src/notification/notification.service";


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
    const forum=this.forumService.getForumById(createThreadDto.forum_id);
    const forumTitle=(await forum).forumTitle;
    const course=this.courseService.findOne((await forum).course_id.toString());
    const users=(await course).students;
    const message = `A new thread "${createThreadDto.threadTitle} has been added to the forum "${forumTitle}" with the content "${createThreadDto.content}`;
    this.notificationService.createNotification(users.toString(),message);
    return await this.threadModel.create(createThreadDto);
  }

  async search(searchThreadDto : SearchThreadDto)
  {
    const threads = await this.threadModel.find(searchThreadDto);
    return threads;
  }

  async updateThread(updateThreadDto : UpdateThreadDto)
  {
    const objectId = new Types.ObjectId(updateThreadDto.thread_id);
    const thread = this.threadModel.findByIdAndUpdate(objectId , updateThreadDto);
    (await thread).save();
    return thread;
  }

  async searchThreadsByKeyword(keyword: string): Promise<Thread[]> {
    return this.threadModel
      .find({
        $text: { $search: keyword }, // MongoDB text search
      })
      .exec();
  }

  async deleteThread(threadId:string)
  {
    return await this.threadModel.findByIdAndDelete(new Types.ObjectId(threadId));
  }
  async getThreadReplies(threadId: string) {
    // Validate and cast the forumId to ObjectId
    if (!Types.ObjectId.isValid(threadId)) {
      throw new Error('Invalid forum ID');
    }
  
    const threadObjectId = new Types.ObjectId(threadId);

    return await this.replyModel.find({ thread_id: threadObjectId }).exec();
  }
}
