import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SystemSetting } from './entities/system-setting.entity';
import { User } from '../user/entities/user.entity';
import { Post } from '../community/entities/post.entity';
import { Comment } from '../community/entities/comment.entity';
import { Category } from '../community/entities/category.entity';
import { Resume } from '../resume/entities/resume.entity';
import { Application } from '../application/entities/application.entity';
import { Job } from '../job/entities/job.entity';
import { Company } from '../company/entities/company.entity';
import { DictType, DictItem } from './entities/dict.entity';
import { AiCallLog } from './entities/ai-call-log.entity';
import { NotificationModule } from '../notification/notification.module';
import { AiRuntimeService } from './ai-runtime.service';
import { AnnouncementRecord } from './entities/announcement-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemSetting, User, Post, Comment, Category, Resume, Application, Job, Company, DictType, DictItem, AiCallLog, AnnouncementRecord,
    ]),
    NotificationModule,
  ],
  controllers: [SystemController],
  providers: [SystemService, AiRuntimeService],
  exports: [SystemService, AiRuntimeService],
})
export class SystemModule {}
