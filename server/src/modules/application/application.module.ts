import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity';
import { ApplicationStatusLog } from './entities/application-status-log.entity';
import { ApplicationNote } from './entities/application-note.entity';
import { Resume } from '../resume/entities/resume.entity';
import { Job } from '../job/entities/job.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    TypeOrmModule.forFeature([Application, ApplicationStatusLog, ApplicationNote, Resume, Job]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
