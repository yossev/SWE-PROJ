/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model, Types } from "mongoose";
import { CreateReplyDto } from "./dto/createReply.dto";
import { Reply, ReplyDocument } from "models/reply-schema";
import { Thread, ThreadDocument } from "models/thread-schema";
import { UpdateThreadDto } from "src/thread/dto/updateThread.dto";
import { UpdateReplyDto } from "./dto/updateReply.dto";
import { NotificationService } from "src/notification/notification.service";

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    private readonly notificationService : NotificationService
  ) {}

  // Create a reply within a thread
  async createReply(@Req() req,createReplyDto: CreateReplyDto) {
    const { thread_id} = createReplyDto;

    const thread = await this.threadModel.findById(thread_id);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }
    createReplyDto.createdBy=req.cookies.userId;
    const message = `You have received a reply to your thread: "${createReplyDto.content}`;
    this.notificationService.createNotification(thread.createdBy.toString(),message);
    return await this.replyModel.create(createReplyDto);
  }
  async deleteReply(replyId:string)
    {
      return await this.replyModel.findByIdAndDelete(new Types.ObjectId(replyId));
    }
    async updateReply(updateReplyDto: UpdateReplyDto) {
      const objectId = new Types.ObjectId(updateReplyDto.reply_id);
    
      // Perform the update and return the updated document
      const reply = await this.replyModel.findByIdAndUpdate(
        objectId,                  // ID of the document to update
        updateReplyDto,            // Data to update
        { new: true }              // Return the updated document
      );
    
      // Optional: Add error handling if no document is found
      if (!reply) {
        throw new Error('Reply not found');
      }
    
      return reply;
    }
    
}
