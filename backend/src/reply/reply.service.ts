/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { CreateReplyDto } from "./dto/createReply.dto";
import { Reply, ReplyDocument } from "models/reply-schema";
import { Thread, ThreadDocument } from "models/thread-schema";

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
  ) {}

  // Create a reply within a thread
  async createReply(createReplyDto: CreateReplyDto) {
    const { threadId, content, createdBy } = createReplyDto;

    const thread = await this.threadModel.findById(threadId);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return await this.replyModel.create(createReplyDto);
  }
}
