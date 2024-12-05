/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { Forum, ForumSchema } from 'models/forum-schema';
import { Reply, ReplySchema } from 'models/reply-schema';
import { Thread, ThreadSchema } from 'models/thread-schema';
import { Topic, TopicSchema } from 'models/topic-schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Forum.name, schema: ForumSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Thread.name, schema: ThreadSchema },
      { name: Reply.name, schema: ReplySchema },
    ]),
  ],
  providers: [ForumService],
  controllers: [ForumController],
})
export class ForumModule {}
