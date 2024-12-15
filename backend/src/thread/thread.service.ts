/* eslint-disable prettier/prettier */
import { Injectable, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Thread, ThreadDocument } from "src/models/thread-schema";
import { Model, Types } from "mongoose";
import { CreateThreadDto } from "./dto/createThread.dto";
import { SearchThreadDto } from "./dto/searchThread.dto";
import { UpdateThreadDto } from "./dto/updateThread.dto";


@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>
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
    const objectId = new Types.ObjectId(updateThreadDto.threadId);
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
}
