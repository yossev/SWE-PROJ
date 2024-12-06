/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Thread, ThreadDocument } from "models/thread-schema";
import { Topic, TopicDocument } from "models/topic-schema";
import { Model, Types } from "mongoose";
import { CreateThreadDto } from "./dto/createThread.dto";
import { SearchThreadDto } from "./dto/searchThread.dto";
import { UpdateThreadDto } from "./dto/updateThread.dto";



@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}

  // Create a new thread in a folder
  async createThread(createThreadDto: CreateThreadDto) {
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

    return (await thread).save();
  }



  async deleteThread(threadId:string)
  {
    return await this.threadModel.findByIdAndDelete(new Types.ObjectId(threadId));
  }
}
