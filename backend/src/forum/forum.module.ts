/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { Forum, ForumSchema } from 'src/models/forum-schema';
import { Thread, ThreadSchema } from 'src/models/thread-schema';
import { Reply, ReplySchema } from 'src/models/reply-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Forum.name, schema: ForumSchema },
      { name: Thread.name, schema: ThreadSchema },
      { name: Reply.name, schema: ReplySchema },
    ]),
  ],
  providers: [ForumService],
  controllers: [ForumController],
})
export class ForumModule {}
