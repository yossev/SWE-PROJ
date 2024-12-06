import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { BackupService } from '../backup/backup.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'models/user-schema';
import { CourseSchema } from 'models/course-schema';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
  ],
  providers: [UserService, BackupService],
  controllers:[UserController]
})
export class UserModule {
  constructor(private readonly backupService: BackupService) {
    // Start backup scheduler
    this.backupService.scheduleBackup();
  }
}
