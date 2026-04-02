import { Injectable, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as mammoth from 'mammoth';
import { Resume } from './entities/resume.entity';
import { ResumeTemplate } from './entities/resume-template.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { AiRuntimeService } from '../system/ai-runtime.service';

@Injectable()
export class ResumeService implements OnModuleInit {
  constructor(
    @InjectRepository(Resume) private resumeRepo: Repository<Resume>,
    @InjectRepository(ResumeTemplate) private templateRepo: Repository<ResumeTemplate>,
    private configService: ConfigService,
    private readonly aiRuntimeService: AiRuntimeService,
  ) {}

  async onModuleInit() {
    // Force re-seed: clear old Chinese templates
    const existingCount = await this.templateRepo.count();
    if (existingCount > 0) {
      await this.templateRepo.clear();
      console.log('Cleared old resume templates for English re-seed');
    }

    const count = await this.templateRepo.count();
    if (count < 10) {
      const seeds = this.getTemplateSeedData();
      const existingNames = (await this.templateRepo.find({ select: ['name'] })).map(t => t.name);
      const newSeeds = seeds.filter(s => !existingNames.includes(s.name));
      if (newSeeds.length > 0) {
        await this.templateRepo.save(this.templateRepo.create(newSeeds));
        console.log(`简历模板种子数据已补充 (新增 ${newSeeds.length} 个模板)`);
      }
    }
  }

  private getTemplateSeedData() {
    const baseHtml = this.getDefaultTemplateHtml();
    const baseCss = this.getDefaultTemplateCss();

    const leftBarHtml = `<div class="resume two-col"><div class="sidebar"><div class="avatar-wrap"><img class="avatar-img" src="{{avatar}}" alt="Avatar" /></div><div class="sidebar-section"><h3>Contact</h3><p>{{phone}}</p><p>{{email}}</p></div><div class="sidebar-section"><h3>Education</h3><p>{{school}}</p><p>{{major}}</p><p>{{graduationYear}}</p></div><div class="sidebar-section"><h3>Skills</h3><div class="skills">{{skills}}</div></div></div><div class="main"><div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div><div class="section"><h2>Work Experience</h2>{{experience}}</div><div class="section"><h2>Projects</h2>{{projects}}</div><div class="section"><h2>Awards & Certificates</h2>{{awards}}</div><div class="section"><h2>Activities</h2>{{activities}}</div></div></div>`;
    const leftBarCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Microsoft YaHei',sans-serif;color:#333;background:#fff}.two-col{display:flex;min-height:100vh}.sidebar{width:240px;background:COLOR;color:#fff;padding:30px 20px;flex-shrink:0}.avatar-wrap{text-align:center;margin-bottom:20px}.avatar-img{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3)}.sidebar-section{margin-bottom:20px}.sidebar-section h3{font-size:14px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.3)}.sidebar-section p{font-size:13px;margin-bottom:4px;opacity:0.9}.sidebar .skills{display:flex;flex-wrap:wrap;gap:6px}.sidebar .skill-tag{background:rgba(255,255,255,0.2);color:#fff;padding:2px 8px;border-radius:3px;font-size:12px}.main{flex:1;padding:30px}.section{margin-bottom:20px}.section h2{font-size:18px;color:COLOR;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid COLOR}.section p{line-height:1.8;font-size:14px}.item{margin-bottom:10px;font-size:14px;line-height:1.6}.item strong{color:#333}.item .time{color:#999;font-size:13px;float:right}.item p{color:#666;margin-top:4px}@media print{body{padding:0}@page{margin:10mm}}`;

    const topBannerHtml = `<div class="resume"><div class="banner"><h1>{{name}}</h1><div class="contact-row"><span>{{phone}}</span><span>{{email}}</span><span>{{school}} · {{major}}</span></div></div><div class="body"><div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div><div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div><div class="grid"><div class="section"><h2>Education</h2>{{education}}</div><div class="section"><h2>Work Experience</h2>{{experience}}</div></div><div class="section"><h2>Projects</h2>{{projects}}</div><div class="grid"><div class="section"><h2>Awards & Certificates</h2>{{awards}}</div><div class="section"><h2>Activities</h2>{{activities}}</div></div></div></div>`;
    const topBannerCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Microsoft YaHei',sans-serif;color:#333;background:#fff}.banner{background:linear-gradient(135deg,COLOR,COLORdd);color:#fff;padding:40px;text-align:center}.banner h1{font-size:32px;margin-bottom:10px;letter-spacing:4px}.contact-row{display:flex;justify-content:center;gap:20px;font-size:14px;opacity:0.9}.body{padding:30px 40px}.section{margin-bottom:20px}.section h2{font-size:16px;color:COLOR;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #eee}.section p{line-height:1.8;font-size:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.item{margin-bottom:10px;font-size:14px;line-height:1.6}.item strong{color:#333}.item .time{color:#999;font-size:13px;float:right}.item p{color:#666;margin-top:4px}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:COLOR10;color:COLOR;padding:3px 12px;border-radius:20px;font-size:13px;border:1px solid COLOR30}@media print{.banner{padding:24px}body{padding:0}@page{margin:10mm}}`;

    const timelineHtml = `<div class="resume"><div class="header"><h1>{{name}}</h1><div class="contact">{{phone}} · {{email}} · {{school}} {{major}} {{graduationYear}}</div></div><div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div><div class="section"><h2>Education</h2><div class="timeline">{{education}}</div></div><div class="section"><h2>Work Experience</h2><div class="timeline">{{experience}}</div></div><div class="section"><h2>Projects</h2><div class="timeline">{{projects}}</div></div><div class="section"><h2>Awards & Certificates</h2><div class="timeline">{{awards}}</div></div><div class="section"><h2>Activities</h2><div class="timeline">{{activities}}</div></div><div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div></div>`;
    const timelineCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Microsoft YaHei',sans-serif;color:#333;background:#fff;padding:40px}.resume{max-width:800px;margin:0 auto}.header{margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid COLOR}.header h1{font-size:30px;color:COLOR;margin-bottom:6px}.contact{font-size:14px;color:#666}.section{margin-bottom:22px}.section h2{font-size:16px;color:COLOR;margin-bottom:12px;display:flex;align-items:center;gap:8px}.section h2::before{content:'';width:4px;height:16px;background:COLOR;border-radius:2px}.section p{line-height:1.8;font-size:14px}.timeline{border-left:2px solid COLOR30;padding-left:16px}.item{margin-bottom:12px;position:relative;font-size:14px;line-height:1.6}.item::before{content:'';position:absolute;left:-21px;top:6px;width:10px;height:10px;background:COLOR;border-radius:50%}.item strong{color:#333}.item .time{color:#999;font-size:13px;float:right}.item p{color:#666;margin-top:4px}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:COLOR10;color:COLOR;padding:3px 12px;border-radius:4px;font-size:13px}@media print{body{padding:20px}@page{margin:15mm}}`;

    return [
      { name: 'Clean Standard', description: 'A clean template suitable for most positions, blue theme', category: 'General', htmlContent: baseHtml, cssContent: baseCss, sort: 1 },
      { name: 'Deep Blue Pro', description: 'Deep blue theme, highlights technical skills', category: 'Tech', htmlContent: baseHtml, cssContent: baseCss.replace(/#1677ff/g, '#2f54eb'), sort: 2 },
      { name: 'Elegant Purple', description: 'Purple theme, ideal for design and product roles', category: 'Design', htmlContent: baseHtml, cssContent: baseCss.replace(/#1677ff/g, '#722ed1'), sort: 3 },
      { name: 'Classic Sidebar', description: 'Two-column layout with dark sidebar', category: 'General', htmlContent: leftBarHtml, cssContent: leftBarCss.replace(/COLOR/g, '#2f3542'), sort: 4 },
      { name: 'Blue Sidebar', description: 'Blue sidebar, fresh and modern', category: 'Tech', htmlContent: leftBarHtml, cssContent: leftBarCss.replace(/COLOR/g, '#0984e3'), sort: 5 },
      { name: 'Green Sidebar', description: 'Dark green sidebar, professional and elegant', category: 'Finance', htmlContent: leftBarHtml, cssContent: leftBarCss.replace(/COLOR/g, '#00695c'), sort: 6 },
      { name: 'Top Banner', description: 'Gradient top banner with two-column content', category: 'General', htmlContent: topBannerHtml, cssContent: topBannerCss.replace(/COLOR/g, '#1677ff'), sort: 7 },
      { name: 'Warm Banner', description: 'Orange-red banner, ideal for marketing roles', category: 'Marketing', htmlContent: topBannerHtml, cssContent: topBannerCss.replace(/COLOR/g, '#e17055'), sort: 8 },
      { name: 'Timeline', description: 'Left timeline layout, emphasizes experience', category: 'General', htmlContent: timelineHtml, cssContent: timelineCss.replace(/COLOR/g, '#1677ff'), sort: 9 },
      { name: 'Burgundy Timeline', description: 'Burgundy timeline, suitable for liberal arts positions', category: 'Education', htmlContent: timelineHtml, cssContent: timelineCss.replace(/COLOR/g, '#a0522d'), sort: 10 },
    ];
  }

  async findAllAdmin(page = 1, pageSize = 10, keyword?: string, userId?: number) {
    const qb = this.resumeRepo
      .createQueryBuilder('resume')
      .leftJoin('resume.user', 'user')
      .addSelect(['user.id', 'user.username', 'user.nickname', 'user.avatar']);

    if (userId) {
      qb.andWhere('resume.userId = :userId', { userId });
    }
    if (keyword) {
      qb.andWhere(
        '(resume.title LIKE :kw OR user.username LIKE :kw OR user.nickname LIKE :kw)',
        { kw: `%${keyword}%` },
      );
    }

    qb.orderBy('resume.updatedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async create(userId: number, dto: CreateResumeDto) {
    const existingCount = await this.resumeRepo.count({ where: { userId } });
    const resume = this.resumeRepo.create({
      ...dto,
      userId,
      isDefault: existingCount === 0,
      content: dto.content || this.getDefaultContent(),
    });
    return this.resumeRepo.save(resume);
  }

  async findAll(userId: number) {
    return this.resumeRepo.find({
      where: { userId },
      order: { isDefault: 'DESC', updatedAt: 'DESC' },
      select: ['id', 'title', 'targetPosition', 'version', 'templateId', 'isDefault', 'filePath', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number, userId: number) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    return resume;
  }

  async update(id: number, userId: number, dto: UpdateResumeDto) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    Object.assign(resume, dto);
    return this.resumeRepo.save(resume);
  }

  async remove(id: number, userId: number) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    await this.resumeRepo.remove(resume);
  }

  async duplicate(id: number, userId: number) {
    const source = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!source) throw new NotFoundException('简历不存在');

    const copy = this.resumeRepo.create({
      userId,
      title: `${source.title} (副本)`,
      targetPosition: source.targetPosition,
      templateId: source.templateId,
      content: source.content,
      version: source.version + 1,
      isDefault: false,
    });
    return this.resumeRepo.save(copy);
  }

  async setDefault(id: number, userId: number) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    await this.resumeRepo.update({ userId }, { isDefault: false });
    await this.resumeRepo.update({ id, userId }, { isDefault: true });
    return { message: '已设为默认简历' };
  }

  async saveFile(id: number, userId: number, filePath: string) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    resume.filePath = filePath;
    return this.resumeRepo.save(resume);
  }

  async getTemplates(page = 1, pageSize = 20, category?: string, keyword?: string) {
    const qb = this.templateRepo.createQueryBuilder('tpl');

    if (category) {
      qb.andWhere('tpl.category = :category', { category });
    }
    if (keyword) {
      qb.andWhere('(tpl.name LIKE :kw OR tpl.description LIKE :kw)', { kw: `%${keyword}%` });
    }

    qb.orderBy('tpl.sort', 'ASC')
      .addOrderBy('tpl.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async getTemplateCategories(): Promise<string[]> {
    const rows = await this.templateRepo
      .createQueryBuilder('tpl')
      .select('DISTINCT tpl.category', 'category')
      .getRawMany();
    return rows.map((r: any) => r.category).filter(Boolean);
  }

  async analyze(id: number, userId: number) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');

    const content = resume.content || {};
    const analysis = {
      completeness: this.calculateCompleteness(content),
      suggestions: this.generateSuggestions(content),
      keywords: this.extractKeywords(content),
      score: 0,
    };
    analysis.score = analysis.completeness;

    resume.analysisResult = JSON.stringify(analysis);
    await this.resumeRepo.save(resume);

    return analysis;
  }

  async optimize(id: number, userId: number, body?: Record<string, any>) {
    console.log('[optimize] body received:', JSON.stringify(body));
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');

    const configured = await this.aiRuntimeService.isConfigured();
    if (!configured) {
      return {
        message: 'AI优化功能尚未启用（需配置 ARK_API_KEY）',
        suggestions: this.generateSuggestions(resume.content || {}),
      };
    }

    const mode = body?.mode || 'suggest';
    const locale = body?.locale || 'zh-CN';
    const content = resume.content || this.getDefaultContent();
    const fallbackSuggestions = this.generateSuggestions(content);

    // 全量生成模式：AI 生成完整简历内容
    if (mode === 'generate') {
      return this.aiGenerateFullContent(id, resume, body || {}, locale);
    }

    try {
      const aiResult = await this.aiRuntimeService.chatJson<{
        summary?: string;
        suggestions?: string[];
        keywordHighlights?: string[];
      }>({
        scene: 'resume_optimize',
        maxTokens: 1200,
        systemPrompt: [
          '你是一名资深校招简历顾问。',
          '请基于用户的结构化简历信息输出 JSON，不要输出 markdown。',
          'JSON 格式必须为：{"summary":"一句总体建议","suggestions":["建议1","建议2"],"keywordHighlights":["关键词1","关键词2"]}',
          'suggestions 最多返回 6 条，必须具体、可执行、适合校园招聘场景。',
        ].join('\n'),
        userPrompt: JSON.stringify({
          title: resume.title,
          targetPosition: resume.targetPosition,
          content,
        }),
      });

      const suggestions = Array.isArray(aiResult.suggestions) && aiResult.suggestions.length
        ? aiResult.suggestions.slice(0, 6)
        : fallbackSuggestions;

      return {
        message: aiResult.summary || '已完成 AI 简历优化分析',
        suggestions,
        keywordHighlights: Array.isArray(aiResult.keywordHighlights) ? aiResult.keywordHighlights.slice(0, 10) : [],
      };
    } catch {
      return {
        message: 'AI 优化暂时不可用，已返回规则建议',
        suggestions: fallbackSuggestions,
      };
    }
  }

  private async aiGenerateFullContent(
    id: number,
    resume: Resume,
    body: Record<string, any>,
    locale: string,
  ) {
    const basicInfo = body?.basicInfo || resume.content?.basicInfo || {};
    const skills = body?.skills || resume.content?.skills || [];
    const targetPosition = body?.targetPosition || resume.targetPosition || '';

    const isEnglish = locale.startsWith('en');
    const langInstruction = isEnglish
      ? 'All generated content MUST be in English.'
      : '所有生成内容必须使用中文。';

    try {
      const aiResult = await this.aiRuntimeService.chatJson<{
        selfIntro?: string;
        education?: Array<{ school: string; major: string; startDate: string; endDate: string }>;
        experience?: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>;
        projects?: Array<{ name: string; startDate: string; endDate: string; description: string }>;
        awards?: Array<{ name: string; date: string; description: string }>;
        activities?: Array<{ organization: string; role: string; startDate: string; endDate: string; description: string }>;
        jobIntention?: { targetPosition: string; expectedSalary: string; preferredCity: string; workType: string };
      }>({
        scene: 'resume_optimize',
        maxTokens: 3000,
        systemPrompt: [
          '你是一名资深校招简历顾问，帮助应届毕业生生成完整的简历内容。',
          langInstruction,
          '请根据用户提供的基本信息（姓名、学校、专业、毕业年份）和技能列表，生成完整的简历模块内容。',
          '输出必须是严格 JSON 格式，不要输出 markdown。',
          'JSON 结构如下：',
          '{',
          '  "selfIntro": "150-200字的自我介绍，突出专业能力和求职意向",',
          '  "education": [{"school":"学校名","major":"专业","startDate":"如 2023.09","endDate":"如 2027.06"}],',
          '  "experience": [{"company":"公司名","position":"实习岗位","startDate":"如 2025.06","endDate":"如 2025.09","description":"工作内容描述，包含量化成果，100-150字"}],',
          '  "projects": [{"name":"项目名称","startDate":"如 2025.03","endDate":"如 2025.06","description":"项目描述，技术栈+个人职责+成果，150-200字"}],',
          '  "awards": [{"name":"奖项或证书名称","date":"如 2025.06","description":"简要说明"}],',
          '  "activities": [{"organization":"社团/组织名称","role":"职务","startDate":"如 2024.09","endDate":"如 2025.06","description":"活动内容与收获"}],',
          '  "jobIntention": {"targetPosition":"目标岗位","expectedSalary":"如 8-15K","preferredCity":"意向城市","workType":"full_time 或 intern"}',
          '}',
          '要求：',
          '1. 根据用户的专业和技能合理推断适合的实习经历、项目经验',
          '2. 实习经历至少生成 1-2 段，项目经验至少生成 2-3 个',
          '3. 描述要具体、有量化数据（如性能提升百分比、用户量等）',
          '4. education 里使用用户提供的真实学校和专业信息',
          '5. 内容要真实可信，符合应届生水平，不要过度夸大',
          '6. awards 和 activities 各生成 1-2 条',
        ].join('\n'),
        userPrompt: JSON.stringify({
          basicInfo: {
            name: basicInfo.name || '',
            school: basicInfo.school || '',
            major: basicInfo.major || '',
            graduationYear: basicInfo.graduationYear || '',
          },
          skills: Array.isArray(skills) ? skills : [],
          targetPosition,
        }),
      });

      // 合并生成的内容到简历
      const updatedContent = { ...(resume.content || this.getDefaultContent()) };
      updatedContent.basicInfo = { ...updatedContent.basicInfo, ...basicInfo };
      if (Array.isArray(skills) && skills.length) updatedContent.skills = skills;

      if (aiResult.selfIntro) updatedContent.selfIntro = aiResult.selfIntro;
      if (Array.isArray(aiResult.education) && aiResult.education.length) {
        updatedContent.education = aiResult.education;
      }
      if (Array.isArray(aiResult.experience) && aiResult.experience.length) {
        updatedContent.experience = aiResult.experience;
      }
      if (Array.isArray(aiResult.projects) && aiResult.projects.length) {
        updatedContent.projects = aiResult.projects;
      }
      if (Array.isArray(aiResult.awards) && aiResult.awards.length) {
        updatedContent.awards = aiResult.awards;
      }
      if (Array.isArray(aiResult.activities) && aiResult.activities.length) {
        updatedContent.activities = aiResult.activities;
      }
      if (aiResult.jobIntention) {
        updatedContent.jobIntention = { ...(updatedContent.jobIntention || {}), ...aiResult.jobIntention };
      }

      // 仅返回预览，不自动保存到数据库，由前端确认后再调用 PUT /resumes/:id 保存
      return {
        mode: 'generate',
        message: '已成功生成完整简历内容',
        generatedContent: updatedContent,
        preview: true,
      };
    } catch {
      return {
        mode: 'generate',
        message: 'AI 全量生成暂时不可用，请稍后重试',
        suggestions: this.generateSuggestions(resume.content || {}),
      };
    }
  }

  private getDefaultContent(): Record<string, any> {
    return {
      basicInfo: { name: '', phone: '', email: '', school: '', major: '', graduationYear: '' },
      education: [],
      experience: [],
      projects: [],
      skills: [],
      awards: [],
      selfIntro: '',
    };
  }

  private calculateCompleteness(content: Record<string, any>): number {
    let filled = 0;
    let total = 0;

    const basic = content.basicInfo || {};
    const basicFields = ['name', 'phone', 'email', 'school', 'major'];
    for (const f of basicFields) {
      total++;
      if (basic[f]) filled++;
    }

    const sections = ['education', 'experience', 'projects', 'skills'];
    for (const s of sections) {
      total++;
      if (Array.isArray(content[s]) && content[s].length > 0) filled++;
    }

    total++;
    if (content.selfIntro) filled++;

    return total > 0 ? Math.round((filled / total) * 100) : 0;
  }

  private generateSuggestions(content: Record<string, any>): string[] {
    const suggestions: string[] = [];
    const basic = content.basicInfo || {};

    if (!basic.name) suggestions.push('请填写姓名');
    if (!basic.phone) suggestions.push('请填写手机号');
    if (!basic.email) suggestions.push('请填写邮箱');
    if (!basic.school) suggestions.push('请填写学校信息');

    if (!Array.isArray(content.education) || content.education.length === 0) {
      suggestions.push('请添加教育经历');
    }
    if (!Array.isArray(content.projects) || content.projects.length === 0) {
      suggestions.push('建议添加项目经验，这对校招非常重要');
    }
    if (!Array.isArray(content.skills) || content.skills.length === 0) {
      suggestions.push('请添加技能标签');
    }
    if (!content.selfIntro) {
      suggestions.push('建议添加自我评价');
    }

    if (suggestions.length === 0) {
      suggestions.push('简历信息较为完整，建议进一步量化项目成果');
    }

    return suggestions;
  }

  private extractKeywords(content: Record<string, any>): string[] {
    const keywords: string[] = [];

    if (Array.isArray(content.skills)) {
      keywords.push(...content.skills);
    }

    const basic = content.basicInfo || {};
    if (basic.major) keywords.push(basic.major);

    return keywords.slice(0, 20);
  }

  async createTemplate(data: {
    name: string;
    description?: string;
    htmlContent?: string;
    cssContent?: string;
  }) {
    const tpl = this.templateRepo.create({ ...data, isSystem: false });
    return this.templateRepo.save(tpl);
  }

  async updateTemplate(id: number, data: Partial<{
    name: string;
    description: string;
    htmlContent: string;
    cssContent: string;
    sort: number;
  }>) {
    const tpl = await this.templateRepo.findOne({ where: { id } });
    if (!tpl) throw new NotFoundException('模板不存在');
    Object.assign(tpl, data);
    return this.templateRepo.save(tpl);
  }

  async deleteTemplate(id: number) {
    const tpl = await this.templateRepo.findOne({ where: { id } });
    if (!tpl) throw new NotFoundException('模板不存在');
    await this.templateRepo.remove(tpl);
  }

  async getTemplateDetail(id: number) {
    const tpl = await this.templateRepo.findOne({ where: { id } });
    if (!tpl) throw new NotFoundException('模板不存在');
    return tpl;
  }

  async renderResume(id: number, userId: number) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');

    const templateId = resume.templateId || 1;
    const template = await this.templateRepo.findOne({ where: { id: templateId } });

    const content = resume.content || this.getDefaultContent();
    const htmlTemplate = template?.htmlContent || this.getDefaultTemplateHtml();
    const css = template?.cssContent || this.getDefaultTemplateCss();

    const renderedHtml = this.injectContentIntoTemplate(htmlTemplate, content, css);
    return { html: renderedHtml };
  }

  async importTemplateFromDocx(filePath: string, name: string) {
    const result = await mammoth.convertToHtml({ path: filePath });
    const htmlContent = result.value;

    const tpl = this.templateRepo.create({
      name,
      description: `从 Word 文档导入`,
      htmlContent: `<div class="resume">${htmlContent}</div>`,
      cssContent: this.getDefaultTemplateCss(),
      isSystem: false,
    });

    return this.templateRepo.save(tpl);
  }

  private escapeHtml(str: string): string {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  private injectContentIntoTemplate(
    html: string,
    content: Record<string, any>,
    css: string,
  ): string {
    const basic = content.basicInfo || {};
    const skills = Array.isArray(content.skills) ? content.skills : [];
    const education = Array.isArray(content.education) ? content.education : [];
    const experience = Array.isArray(content.experience) ? content.experience : [];
    const projects = Array.isArray(content.projects) ? content.projects : [];
    const awards = Array.isArray(content.awards) ? content.awards : [];
    const activities = Array.isArray(content.activities) ? content.activities : [];
    const esc = (s: string) => this.escapeHtml(s);

    const avatarUrl = basic.avatar || content.avatar || '';
    let result = html
      .replace(/\{\{avatar\}\}/g, avatarUrl ? esc(avatarUrl) : '')
      .replace(/\{\{name\}\}/g, esc(basic.name || ''))
      .replace(/\{\{phone\}\}/g, esc(basic.phone || ''))
      .replace(/\{\{email\}\}/g, esc(basic.email || ''))
      .replace(/\{\{school\}\}/g, esc(basic.school || ''))
      .replace(/\{\{major\}\}/g, esc(basic.major || ''))
      .replace(/\{\{graduationYear\}\}/g, esc(basic.graduationYear || ''))
      .replace(/\{\{selfIntro\}\}/g, esc(content.selfIntro || ''))
      .replace(/\{\{skills\}\}/g, skills.map((s: string) => `<span class="skill-tag">${esc(s)}</span>`).join(' '))
      .replace(/\{\{education\}\}/g, education.map((e: any) =>
        `<div class="item"><strong>${esc(e.school || '')}</strong> - ${esc(e.major || '')} <span class="time">${esc(e.startDate || '')} ~ ${esc(e.endDate || '')}</span></div>`,
      ).join(''))
      .replace(/\{\{experience\}\}/g, experience.map((e: any) =>
        `<div class="item"><strong>${esc(e.company || '')}</strong> - ${esc(e.position || '')} <span class="time">${esc(e.startDate || '')} ~ ${esc(e.endDate || '')}</span><p>${esc(e.description || '')}</p></div>`,
      ).join(''))
      .replace(/\{\{projects\}\}/g, projects.map((p: any) =>
        `<div class="item"><strong>${esc(p.name || '')}</strong> <span class="time">${esc(p.startDate || '')} ~ ${esc(p.endDate || '')}</span><p>${esc(p.description || '')}</p></div>`,
      ).join(''))
      .replace(/\{\{awards\}\}/g, awards.map((a: any) =>
        `<div class="item"><strong>${esc(a.name || '')}</strong> <span class="time">${esc(a.date || '')}</span>${a.description ? `<p>${esc(a.description)}</p>` : ''}</div>`,
      ).join(''))
      .replace(/\{\{activities\}\}/g, activities.map((a: any) =>
        `<div class="item"><strong>${esc(a.organization || '')}</strong> - ${esc(a.role || '')} <span class="time">${esc(a.startDate || '')} ~ ${esc(a.endDate || '')}</span>${a.description ? `<p>${esc(a.description)}</p>` : ''}</div>`,
      ).join(''));

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${result}</body></html>`;
  }

  private getDefaultTemplateHtml(): string {
    return `<div class="resume">
  <div class="header">
    <h1>{{name}}</h1>
    <div class="contact">{{phone}} | {{email}}</div>
    <div class="contact">{{school}} · {{major}} · {{graduationYear}}</div>
  </div>
  <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
  <div class="section"><h2>Education</h2>{{education}}</div>
  <div class="section"><h2>Work Experience</h2>{{experience}}</div>
  <div class="section"><h2>Projects</h2>{{projects}}</div>
  <div class="section"><h2>Awards & Certificates</h2>{{awards}}</div>
  <div class="section"><h2>Activities</h2>{{activities}}</div>
  <div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
</div>`;
  }

  private getDefaultTemplateCss(): string {
    return `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Microsoft YaHei',sans-serif;color:#333;background:#fff;padding:40px}
.resume{max-width:800px;margin:0 auto}
.header{text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #1677ff}
.header h1{font-size:28px;color:#1677ff;margin-bottom:8px}
.contact{font-size:14px;color:#666;margin-bottom:4px}
.section{margin-bottom:20px}
.section h2{font-size:16px;color:#1677ff;border-bottom:1px solid #e8e8e8;padding-bottom:6px;margin-bottom:12px}
.section p{line-height:1.8;font-size:14px}
.item{margin-bottom:10px;font-size:14px;line-height:1.6}
.item strong{color:#333}
.item .time{color:#999;font-size:13px;float:right}
.item p{color:#666;margin-top:4px}
.skills{display:flex;flex-wrap:wrap;gap:8px}
.skill-tag{background:#f0f5ff;color:#1677ff;padding:2px 10px;border-radius:4px;font-size:13px;border:1px solid #d6e4ff}
@media print{body{padding:20px}@page{margin:15mm}}`;
  }
}
