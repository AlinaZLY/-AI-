import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity';
import { ApplicationStatusLog } from './entities/application-status-log.entity';
import { ApplicationNote } from './entities/application-note.entity';
import { Resume } from '../resume/entities/resume.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationStatusLog, ApplicationNote, Resume]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
