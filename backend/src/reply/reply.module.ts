/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reply, ReplySchema } from 'models/reply-schema';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reply.name, schema: ReplySchema },
    ]),
  ],
  providers: [ReplyService],
  controllers: [ReplyController],
})
export class ForumModule {}
