import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { In, Repository } from 'typeorm';
import { SystemSetting } from './entities/system-setting.entity';
import { DictType, DictItem } from './entities/dict.entity';
import { AiCallLog } from './entities/ai-call-log.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { Post, PostStatus } from '../community/entities/post.entity';
import { Comment } from '../community/entities/comment.entity';
import { Category } from '../community/entities/category.entity';
import { Resume } from '../resume/entities/resume.entity';
import { Application } from '../application/entities/application.entity';
import { Job } from '../job/entities/job.entity';
import { Company } from '../company/entities/company.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';
import { SendAnnouncementDto } from './dto/send-announcement.dto';

@Injectable()
export class SystemService {
  private static readonly NOTIFICATION_CONTENT_MAX = 500;

  constructor(
    private configService: ConfigService,
    private readonly notificationService: NotificationService,
    @InjectRepository(SystemSetting)
    private settingRepository: Repository<SystemSetting>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(DictType)
    private dictTypeRepo: Repository<DictType>,
    @InjectRepository(DictItem)
    private dictItemRepo: Repository<DictItem>,
    @InjectRepository(AiCallLog)
    private aiLogRepo: Repository<AiCallLog>,
  ) {}

  /** 向指定范围活跃用户发送系统公告通知 */
  async sendAnnouncement(dto: SendAnnouncementDto): Promise<{ message: string; notifiedCount: number }> {
    const title = dto.title.trim();
    const content = dto.content.trim();
    const raw = `[公告] ${title}: ${content}`;
    const text =
      raw.length > SystemService.NOTIFICATION_CONTENT_MAX
        ? raw.slice(0, SystemService.NOTIFICATION_CONTENT_MAX)
        : raw;

    const target = dto.target ?? 'all';
    const userIds = dto.userIds?.filter((id) => Number.isInteger(id));

    let users: { id: number }[];

    if (userIds && userIds.length > 0) {
      users = await this.userRepository.find({
        where: { id: In(userIds), isActive: true },
        select: ['id'],
      });
    } else if (target === 'student') {
      users = await this.userRepository.find({
        where: { isActive: true, role: UserRole.STUDENT },
        select: ['id'],
      });
    } else if (target === 'enterprise') {
      users = await this.userRepository.find({
        where: { isActive: true, role: UserRole.ENTERPRISE },
        select: ['id'],
      });
    } else {
      users = await this.userRepository.find({
        where: { isActive: true },
        select: ['id'],
      });
    }

    let notifiedCount = 0;
    for (const user of users) {
      await this.notificationService.create({
        type: NotificationType.SYSTEM,
        userId: user.id,
        content: text,
      });
      notifiedCount += 1;
    }

    return {
      message: `公告已发送，共通知 ${notifiedCount} 位用户`,
      notifiedCount,
    };
  }

  async initDictData() {
    const count = await this.dictTypeRepo.count();
    if (count > 0) return;

    const types = [
      { code: 'application_channel', name: '投递渠道', items: [
        { value: 'official', label: '官网', sort: 1 },
        { value: 'boss', label: 'Boss直聘', sort: 2 },
        { value: 'nowcoder', label: '牛客网', sort: 3 },
        { value: 'lagou', label: '拉勾', sort: 4 },
        { value: 'zhilian', label: '智联招聘', sort: 5 },
        { value: 'liepin', label: '猎聘', sort: 6 },
        { value: 'campus', label: '校招宣讲', sort: 7 },
        { value: 'referral', label: '内推', sort: 8 },
        { value: 'other', label: '其他', sort: 99 },
      ]},
      { code: 'question_type', name: '面试题类型', items: [
        { value: 'behavioral', label: '行为面试', sort: 1 },
        { value: 'technical', label: '技术题', sort: 2 },
        { value: 'situational', label: '情景题', sort: 3 },
        { value: 'brain_teaser', label: '智力题', sort: 4 },
        { value: 'case_study', label: '案例分析', sort: 5 },
      ]},
      { code: 'position_type', name: '岗位类型', items: [
        { value: 'frontend', label: '前端开发', sort: 1 },
        { value: 'backend', label: '后端开发', sort: 2 },
        { value: 'fullstack', label: '全栈开发', sort: 3 },
        { value: 'mobile', label: '移动开发', sort: 4 },
        { value: 'data', label: '数据分析', sort: 5 },
        { value: 'ai', label: 'AI/算法', sort: 6 },
        { value: 'product', label: '产品经理', sort: 7 },
        { value: 'design', label: 'UI设计', sort: 8 },
        { value: 'test', label: '测试开发', sort: 9 },
        { value: 'devops', label: '运维', sort: 10 },
      ]},
    ];

    for (const t of types) {
      const dictType = await this.dictTypeRepo.save(this.dictTypeRepo.create({ code: t.code, name: t.name }));
      for (const item of t.items) {
        await this.dictItemRepo.save(this.dictItemRepo.create({ ...item, dictTypeId: dictType.id }));
      }
    }
    console.log('数据字典种子数据已初始化');
  }

  /** 获取所有系统设置 */
  private static readonly SENSITIVE_KEYS = new Set([
    'ark_api_key', 'ark_model_id',
    'volc_access_key_id', 'volc_secret_access_key',
    'voice_app_id', 'voice_api_key', 'voice_access_token',
  ]);

  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.settingRepository.find();
    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return result;
  }

  async getPublicSettings(): Promise<Record<string, string>> {
    const settings = await this.settingRepository.find();
    const result: Record<string, string> = {};
    for (const setting of settings) {
      if (!SystemService.SENSITIVE_KEYS.has(setting.key)) {
        result[setting.key] = setting.value;
      }
    }
    return result;
  }

  /** 获取单个配置项 */
  async getSetting(key: string): Promise<string | null> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    return setting ? setting.value : null;
  }

  /** 更新配置项（不存在则创建） */
  async updateSetting(key: string, value: string, description?: string): Promise<SystemSetting> {
    let setting = await this.settingRepository.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
    } else {
      setting = this.settingRepository.create({ key, value, description: description || '' });
    }
    return this.settingRepository.save(setting);
  }

  /** 批量更新配置 */
  async updateSettings(settings: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      await this.updateSetting(key, value);
    }
  }

  async getDictTypes() {
    return this.dictTypeRepo.find({ relations: ['items'], order: { id: 'ASC' } });
  }

  async getDictByCode(code: string) {
    const dictType = await this.dictTypeRepo.findOne({ where: { code }, relations: ['items'] });
    if (!dictType) return [];
    return dictType.items.filter(i => i.isEnabled).sort((a, b) => a.sort - b.sort);
  }

  async createDictType(data: { code: string; name: string; description?: string }) {
    return this.dictTypeRepo.save(this.dictTypeRepo.create(data));
  }

  async createDictItem(data: { dictTypeId: number; value: string; label: string; color?: string; sort?: number }) {
    return this.dictItemRepo.save(this.dictItemRepo.create(data));
  }

  async updateDictItem(id: number, data: Partial<{ value: string; label: string; color: string; sort: number; isEnabled: boolean }>) {
    const item = await this.dictItemRepo.findOne({ where: { id } });
    if (!item) return;
    Object.assign(item, data);
    return this.dictItemRepo.save(item);
  }

  async deleteDictItem(id: number) {
    await this.dictItemRepo.delete(id);
  }

  async deleteDictType(id: number) {
    await this.dictTypeRepo.delete(id);
  }

  async testAiConnection() {
    const settings = await this.getAllSettings();
    const apiKey = settings['ark_api_key'] || this.configService.get('ARK_API_KEY');
    const baseUrl = settings['ark_base_url'] || 'https://ark.cn-beijing.volces.com/api/v3';
    const modelId = settings['ark_model_id'] || this.configService.get('ARK_MODEL_ID');

    if (!apiKey || apiKey === 'your_ark_api_key') {
      return { success: false, message: 'API Key 未配置' };
    }
    if (!modelId || modelId === 'your_model_endpoint_id') {
      return { success: false, message: 'Model ID 未配置' };
    }

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        return { success: true, message: '连接成功' };
      } else {
        const data = await response.json().catch(() => ({}));
        return { success: false, message: `连接失败: ${(data as any)?.error?.message || response.statusText}` };
      }
    } catch (e: any) {
      return { success: false, message: `连接失败: ${e.message}` };
    }
  }

  async queryBilling(month?: string) {
    const settings = await this.getAllSettings();
    const ak = settings['volc_access_key_id'] || this.configService.get('VOLC_ACCESS_KEY_ID');
    const sk = settings['volc_secret_access_key'] || this.configService.get('VOLC_SECRET_ACCESS_KEY');
    if (!ak || !sk) return { success: false, message: 'AccessKey 未配置', data: null };

    const billPeriod = month || new Date().toISOString().substring(0, 7);
    try {
      const result = await this.volcApiCall(ak, sk, 'ListBillOverviewByProd', {
        BillPeriod: billPeriod,
        Limit: 100,
        Offset: 0,
      });
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message, data: null };
    }
  }

  async queryBalance() {
    const settings = await this.getAllSettings();
    const ak = settings['volc_access_key_id'] || this.configService.get('VOLC_ACCESS_KEY_ID');
    const sk = settings['volc_secret_access_key'] || this.configService.get('VOLC_SECRET_ACCESS_KEY');
    if (!ak || !sk) return { success: false, message: 'AccessKey 未配置', data: null };

    try {
      const result = await this.volcApiCall(ak, sk, 'QueryBalanceAcct', {});
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message, data: null };
    }
  }

  private async volcApiCall(ak: string, sk: string, action: string, body: Record<string, any>) {
    const crypto = require('crypto');
    const host = 'billing.volcengineapi.com';
    const service = 'billing';
    const region = 'cn-north-1';
    const version = '2022-01-01';
    const now = new Date();
    const xDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z/, 'Z');
    const shortDate = xDate.substring(0, 8);
    const bodyStr = JSON.stringify(body);
    const contentType = 'application/json';
    const method = 'POST';

    const hashedPayload = crypto.createHash('sha256').update(bodyStr).digest('hex');

    const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-date:${xDate}\n`;
    const signedHeaders = 'content-type;host;x-date';
    const canonicalRequest = [
      method,
      '/',
      `Action=${action}&Version=${version}`,
      canonicalHeaders,
      signedHeaders,
      hashedPayload,
    ].join('\n');

    const credentialScope = `${shortDate}/${region}/${service}/request`;
    const hashedCanonical = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
    const stringToSign = `HMAC-SHA256\n${xDate}\n${credentialScope}\n${hashedCanonical}`;

    const kDate = crypto.createHmac('sha256', sk).update(shortDate).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorization = `HMAC-SHA256 Credential=${ak}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const url = `https://${host}/?Action=${action}&Version=${version}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': contentType,
        'Host': host,
        'X-Date': xDate,
        'Authorization': authorization,
      },
      body: bodyStr,
    });

    const data = await res.json();
    if ((data as any)?.ResponseMetadata?.Error) {
      throw new Error((data as any).ResponseMetadata.Error.Message || 'API调用失败');
    }
    return (data as any)?.Result || data;
  }

  async getAiCallLogs(limit = 100) {
    const safeLimit = Math.min(limit || 100, 500);
    return this.aiLogRepo.find({
      order: { createdAt: 'DESC' },
      take: safeLimit,
    });
  }

  /** 火山引擎语音识别 - 提交任务 */
  async speechSubmit(audioUrl: string, options?: { format?: string; language?: string }) {
    const settings = await this.getAllSettings();
    const appKey = settings['voice_app_id'] || '';
    const accessKey = settings['voice_api_key'] || '';
    if (!appKey || !accessKey) {
      return { success: false, message: '语音服务未配置，请在 AI 配置-配置 KEY 中填写语音 App ID 和 API Key' };
    }
    const taskId = crypto.randomUUID();
    const body = {
      user: { uid: `user_${Date.now()}` },
      audio: {
        format: options?.format || 'mp3',
        url: audioUrl,
      },
      request: {
        model_name: 'bigmodel',
        enable_itn: true,
        enable_punc: true,
      },
    };
    if (options?.language) {
      (body as any).audio.language = options.language;
    }
    const res = await fetch('https://openspeech.bytedance.com/api/v3/auc/bigmodel/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-App-Key': appKey,
        'X-Api-Access-Key': accessKey,
        'X-Api-Resource-Id': 'volc.seedasr.auc',
        'X-Api-Request-Id': taskId,
        'X-Api-Sequence': '-1',
      },
      body: JSON.stringify(body),
    });
    const statusCode = res.headers.get('X-Api-Status-Code');
    const message = res.headers.get('X-Api-Message') || '';
    if (statusCode === '20000000') {
      return { success: true, taskId };
    }
    return { success: false, message: `提交失败: ${message || res.statusText}` };
  }

  /** 火山引擎语音识别 - 查询结果 */
  async speechQuery(taskId: string) {
    const settings = await this.getAllSettings();
    const appKey = settings['voice_app_id'] || '';
    const accessKey = settings['voice_api_key'] || '';
    if (!appKey || !accessKey) {
      return { success: false, message: '语音服务未配置' };
    }
    const res = await fetch('https://openspeech.bytedance.com/api/v3/auc/bigmodel/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-App-Key': appKey,
        'X-Api-Access-Key': accessKey,
        'X-Api-Resource-Id': 'volc.seedasr.auc',
        'X-Api-Request-Id': taskId,
        'X-Api-Sequence': '-1',
      },
      body: '{}',
    });
    const statusCode = res.headers.get('X-Api-Status-Code');
    const data = await res.json().catch(() => ({}));
    if (statusCode === '20000000' && data.result?.text) {
      return { success: true, text: data.result.text, result: data };
    }
    if (statusCode === '20000000' && !data.result?.text) {
      return { success: false, message: '识别中，请稍后查询', status: 'processing' };
    }
    return { success: false, message: (data as any)?.message || '查询失败' };
  }

  /** 火山引擎语音识别 - 一站式识别（提交+轮询） */
  async speechRecognize(audioUrl: string, options?: { format?: string; language?: string }) {
    const submitRes = await this.speechSubmit(audioUrl, options);
    if (!submitRes.success) return submitRes;
    const taskId = (submitRes as any).taskId;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const queryRes = await this.speechQuery(taskId);
      if (queryRes.success) return queryRes;
      if ((queryRes as any).status !== 'processing') return queryRes;
    }
    return { success: false, message: '识别超时' };
  }

  async getDashboardStats(startDate?: string, endDate?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rangeStart = startDate ? new Date(startDate) : undefined;
    const rangeEnd = endDate ? new Date(endDate + ' 23:59:59') : undefined;

    const [
      totalUsers,
      activeUsers,
      totalPosts,
      pendingPosts,
      approvedPosts,
      rejectedPosts,
      totalComments,
      totalResumes,
      totalApplications,
      totalJobs,
      totalCompanies,
      todayPosts,
      todayComments,
      todayUsers,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.postRepository.count(),
      this.postRepository.count({ where: { status: PostStatus.PENDING } }),
      this.postRepository.count({ where: { status: PostStatus.APPROVED } }),
      this.postRepository.count({ where: { status: PostStatus.REJECTED } }),
      this.commentRepository.count(),
      this.resumeRepository.count(),
      this.applicationRepository.count(),
      this.jobRepository.count(),
      this.companyRepository.count(),
      this.postRepository
        .createQueryBuilder('post')
        .where('post.createdAt >= :today', { today })
        .getCount(),
      this.commentRepository
        .createQueryBuilder('comment')
        .where('comment.createdAt >= :today', { today })
        .getCount(),
      this.userRepository
        .createQueryBuilder('user')
        .where('user.createdAt >= :today', { today })
        .getCount(),
    ]);

    const categoryStats = await this.postRepository
      .createQueryBuilder('post')
      .select('category.name', 'name')
      .addSelect('COUNT(post.id)', 'count')
      .leftJoin('post.category', 'category')
      .groupBy('post.categoryId')
      .addGroupBy('category.name')
      .getRawMany()
      .then((rows) => rows.map((r) => ({ name: r.name || '未分类', count: Number(r.count) })));

    const roleStatsRaw = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const roleLabels: Record<string, string> = {
      [UserRole.STUDENT]: '学生',
      [UserRole.ENTERPRISE]: '企业',
      [UserRole.ADMIN]: '管理员',
    };
    const roleStats = roleStatsRaw.map((r) => ({
      role: roleLabels[r.role] || r.role,
      count: Number(r.count),
    }));

    let rangeUsers = 0, rangePosts = 0, rangeComments = 0,
        rangeResumes = 0, rangeApplications = 0, rangeJobs = 0, rangeCompanies = 0;
    if (rangeStart && rangeEnd) {
      [rangeUsers, rangePosts, rangeComments, rangeResumes, rangeApplications, rangeJobs, rangeCompanies] =
        await Promise.all([
          this.userRepository.createQueryBuilder('u').where('u.createdAt BETWEEN :s AND :e', { s: rangeStart, e: rangeEnd }).getCount(),
          this.postRepository.createQueryBuilder('p').where('p.createdAt BETWEEN :s AND :e', { s: rangeStart, e: rangeEnd }).getCount(),
          this.commentRepository.createQueryBuilder('c').where('c.createdAt BETWEEN :s AND :e', { s: rangeStart, e: rangeEnd }).getCount(),
          this.resumeRepository.createQueryBuilder('r').where('r.createdAt BETWEEN :s AND :e', { s: rangeStart, e: rangeEnd }).getCount(),
          this.applicationRepository.createQueryBuilder('a').where('a.createdAt BETWEEN :s AND :e', { s: rangeStart, e: rangeEnd }).getCount(),
          this.jobRepository.createQueryBuilder('j').where('j.createdAt BETWEEN :s AND :e', { s: rangeStart, e: rangeEnd }).getCount(),
          this.companyRepository.createQueryBuilder('co').where('co.createdAt BETWEEN :s AND :e', { s: rangeStart, e: rangeEnd }).getCount(),
        ]);
    }

    return {
      totalUsers, activeUsers,
      totalPosts, pendingPosts, approvedPosts, rejectedPosts,
      totalComments, totalResumes, totalApplications, totalJobs, totalCompanies,
      todayPosts, todayComments, todayUsers,
      rangeUsers, rangePosts, rangeComments, rangeResumes, rangeApplications, rangeJobs, rangeCompanies,
      categoryStats, roleStats,
    };
  }
}
