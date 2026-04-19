import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { Interview } from './entities/interview.entity';
import { InterviewQuestion } from './entities/interview-question.entity';
import { QuestionBank } from './entities/question-bank.entity';
import { QuestionCategory } from './entities/question-category.entity';
import { PracticeRecord } from './entities/practice-record.entity';
import { Resume } from '../resume/entities/resume.entity';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview, InterviewQuestion, QuestionBank, QuestionCategory, PracticeRecord, Resume]),
    SystemModule,
  ],
  controllers: [InterviewController],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}
