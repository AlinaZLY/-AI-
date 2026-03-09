/**
 * 系统设置控制器
 * 管理平台全局配置（网站名称等），需要管理员权限
 */
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe, OnModuleInit, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { SendAnnouncementDto } from './dto/send-announcement.dto';

const speechDir = join(process.cwd(), 'uploads', 'speech');
if (!existsSync(speechDir)) mkdirSync(speechDir, { recursive: true });

@Controller('system')
export class SystemController implements OnModuleInit {
  constructor(private readonly systemService: SystemService) {}

  async onModuleInit() {
    await this.systemService.initDictData();
  }

  /** GET /api/system/settings - 获取系统设置（管理员获取全部，非管理员仅获取安全子集） */
  @Get('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getSettings() {
    return this.systemService.getAllSettings();
  }

  /** GET /api/system/settings/public - 获取公开系统设置（不含敏感密钥） */
  @Get('settings/public')
  async getPublicSettings() {
    return this.systemService.getPublicSettings();
  }

  /** PUT /api/system/settings - 更新系统设置（需要管理员权限） */
  @Put('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSettings(@Body() body: Record<string, string>) {
    await this.systemService.updateSettings(body);
    return { message: '设置更新成功' };
  }

  /** POST /api/system/ai-test - 测试AI连接（通过后端代理，避免前端暴露API Key） */
  @Post('ai-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async testAiConnection() {
    return this.systemService.testAiConnection();
  }

  /** GET /api/system/billing - 查询火山引擎账单 */
  @Get('billing')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getBilling(@Query('month') month?: string) {
    return this.systemService.queryBilling(month);
  }

  /** GET /api/system/balance - 查询账户余额 */
  @Get('balance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getBalance() {
    return this.systemService.queryBalance();
  }

  /** GET /api/system/ai-logs - 查询 AI 调用日志 */
  @Get('ai-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAiLogs(@Query('limit') limit?: string) {
    const logs = await this.systemService.getAiCallLogs(limit ? parseInt(limit, 10) : 100);
    return { success: true, data: logs };
  }

  /** POST /api/system/speech/submit - 火山语音识别-提交任务 */
  @Post('speech/submit')
  @UseGuards(JwtAuthGuard)
  async speechSubmit(@Body() body: { audioUrl: string; format?: string; language?: string }) {
    return this.systemService.speechSubmit(body.audioUrl, { format: body.format, language: body.language });
  }

  /** POST /api/system/speech/query - 火山语音识别-查询结果 */
  @Post('speech/query')
  @UseGuards(JwtAuthGuard)
  async speechQuery(@Body() body: { taskId: string }) {
    return this.systemService.speechQuery(body.taskId);
  }

  /** POST /api/system/speech/recognize - 火山语音识别-一站式（提交+轮询） */
  @Post('speech/recognize')
  @UseGuards(JwtAuthGuard)
  async speechRecognize(@Body() body: { audioUrl: string; format?: string; language?: string }) {
    return this.systemService.speechRecognize(body.audioUrl, { format: body.format, language: body.language });
  }

  /** POST /api/system/speech/upload - 上传音频文件用于语音识别（需公网可访问的服务器） */
  @Post('speech/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: speechDir,
      filename: (_, file, cb) => cb(null, `speech_${Date.now()}_${Math.random().toString(36).slice(2)}${file.originalname?.match(/\.[^.]+$/)?.[0] || '.mp3'}`),
    }),
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  }))
  async speechUpload(@UploadedFile() file: Express.Multer.File, @Query('baseUrl') baseUrl?: string) {
    if (!file) return { success: false, message: '请上传音频文件' };
    const path = `/uploads/speech/${file.filename}`;
    const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}${path}` : path;
    return { success: true, url, path };
  }

  /** GET /api/system/stats - 获取仪表盘统计数据（需要管理员权限） */
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getDashboardStats(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.systemService.getDashboardStats(startDate, endDate);
  }

  /** POST /api/system/announcement - 向指定范围活跃用户发送系统公告通知 */
  @Post('announcement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async sendAnnouncement(@Body() body: SendAnnouncementDto) {
    return this.systemService.sendAnnouncement(body);
  }

  @Get('dict')
  async getDictTypes() {
    return this.systemService.getDictTypes();
  }

  @Get('dict/:code')
  async getDictByCode(@Param('code') code: string) {
    return this.systemService.getDictByCode(code);
  }

  @Post('dict/types')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createDictType(@Body() body: { code: string; name: string; description?: string }) {
    return this.systemService.createDictType(body);
  }

  @Post('dict/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createDictItem(@Body() body: { dictTypeId: number; value: string; label: string; color?: string; sort?: number }) {
    return this.systemService.createDictItem(body);
  }

  @Put('dict/items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateDictItem(@Param('id', ParseIntPipe) id: number, @Body() body: { value?: string; label?: string; color?: string; sort?: number }) {
    return this.systemService.updateDictItem(id, body);
  }

  @Delete('dict/items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteDictItem(@Param('id', ParseIntPipe) id: number) {
    return this.systemService.deleteDictItem(id);
  }

  @Delete('dict/types/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteDictType(@Param('id', ParseIntPipe) id: number) {
    return this.systemService.deleteDictType(id);
  }
}
