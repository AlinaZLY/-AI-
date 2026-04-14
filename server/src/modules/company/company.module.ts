import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { NotificationModule } from '../notification/notification.module';
import { Job } from '../job/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Job]), NotificationModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
