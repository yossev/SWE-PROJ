/* eslint-disable prettier/prettier */
import { Injectable, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Thread, ThreadDocument } from "src/models/thread-schema";
import { Model, Types } from "mongoose";
import { CreateThreadDto } from "./dto/createThread.dto";
import { SearchThreadDto } from "./dto/searchThread.dto";
import { UpdateThreadDto } from "./dto/updateThread.dto";
import { Reply } from "models/reply-schema";


@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    @InjectModel(Reply.name) private replyModel: Model<ThreadDocument>
  ) {}

  // Create a new thread in a folder
  async createThread(@Req() req,createThreadDto: CreateThreadDto) {
    createThreadDto.createdBy=req.cookies.userId;
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
