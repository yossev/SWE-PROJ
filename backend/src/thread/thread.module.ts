/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Forum, ForumSchema } from 'src/models/forum-schema';
import { Thread , ThreadSchema } from 'src/models/thread-schema';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { Reply, ReplySchema } from 'models/reply-schema';




@Module({
    imports: [
      MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
      MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
      MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }])
      //CourseModule, // Import the CourseModule to use Course services
    ],
    controllers: [ThreadController],
    providers: [ThreadService],
  })
  export class ThreadModule {}