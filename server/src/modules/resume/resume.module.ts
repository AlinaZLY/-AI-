import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { Resume } from './entities/resume.entity';
import { ResumeTemplate } from './entities/resume-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resume, ResumeTemplate])],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
