/**
 * 系统设置模块
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { SystemSetting } from './entities/system-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSetting])],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
