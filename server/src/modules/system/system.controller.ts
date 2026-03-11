/**
 * 系统设置控制器
 * 管理平台全局配置（网站名称等），需要管理员权限
 */
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  /** GET /api/system/settings - 获取所有系统设置（公开接口） */
  @Get('settings')
  async getSettings() {
    return this.systemService.getAllSettings();
  }

  /** PUT /api/system/settings - 更新系统设置（需要管理员权限） */
  @Put('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSettings(@Body() body: Record<string, string>) {
    await this.systemService.updateSettings(body);
    return { message: '设置更新成功' };
  }
}
