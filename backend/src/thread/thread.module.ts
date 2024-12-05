/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Forum, ForumSchema } from 'models/forum-schema';
import { Thread, ThreadSchema } from 'models/thread-schema';
import { Topic, TopicSchema } from 'models/topic-schema';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';




@Module({
    imports: [
      MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
      MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
      MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }])
      //CourseModule, // Import the CourseModule to use Course services
    ],
    controllers: [ThreadController],
    providers: [ThreadService],
  })
  export class ThreadModule {}