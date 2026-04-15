import { Injectable, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as mammoth from 'mammoth';
import { Resume } from './entities/resume.entity';
import { ResumeTemplate } from './entities/resume-template.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumeService implements OnModuleInit {
  constructor(
    @InjectRepository(Resume) private resumeRepo: Repository<Resume>,
    @InjectRepository(ResumeTemplate) private templateRepo: Repository<ResumeTemplate>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
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

    const leftBarHtml = `<div class="resume two-col"><div class="sidebar"><div class="avatar-wrap"><img class="avatar-img" src="{{avatar}}" alt="头像" /></div><div class="sidebar-section"><h3>联系方式</h3><p>{{phone}}</p><p>{{email}}</p></div><div class="sidebar-section"><h3>教育背景</h3><p>{{school}}</p><p>{{major}}</p><p>{{graduationYear}}</p></div><div class="sidebar-section"><h3>技能</h3><div class="skills">{{skills}}</div></div></div><div class="main"><div class="section"><h2>自我评价</h2><p>{{selfIntro}}</p></div><div class="section"><h2>实习/工作经历</h2>{{experience}}</div><div class="section"><h2>项目经验</h2>{{projects}}</div></div></div>`;
    const leftBarCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Microsoft YaHei',sans-serif;color:#333;background:#fff}.two-col{display:flex;min-height:100vh}.sidebar{width:240px;background:COLOR;color:#fff;padding:30px 20px;flex-shrink:0}.avatar-wrap{text-align:center;margin-bottom:20px}.avatar-img{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3)}.sidebar-section{margin-bottom:20px}.sidebar-section h3{font-size:14px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.3)}.sidebar-section p{font-size:13px;margin-bottom:4px;opacity:0.9}.sidebar .skills{display:flex;flex-wrap:wrap;gap:6px}.sidebar .skill-tag{background:rgba(255,255,255,0.2);color:#fff;padding:2px 8px;border-radius:3px;font-size:12px}.main{flex:1;padding:30px}.section{margin-bottom:20px}.section h2{font-size:18px;color:COLOR;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid COLOR}.section p{line-height:1.8;font-size:14px}.item{margin-bottom:10px;font-size:14px;line-height:1.6}.item strong{color:#333}.item .time{color:#999;font-size:13px;float:right}.item p{color:#666;margin-top:4px}@media print{body{padding:0}@page{margin:10mm}}`;

    const topBannerHtml = `<div class="resume"><div class="banner"><h1>{{name}}</h1><div class="contact-row"><span>{{phone}}</span><span>{{email}}</span><span>{{school}} · {{major}}</span></div></div><div class="body"><div class="section"><h2>自我评价</h2><p>{{selfIntro}}</p></div><div class="section"><h2>技能</h2><div class="skills">{{skills}}</div></div><div class="grid"><div class="section"><h2>教育经历</h2>{{education}}</div><div class="section"><h2>实习经历</h2>{{experience}}</div></div><div class="section"><h2>项目经验</h2>{{projects}}</div></div></div>`;
    const topBannerCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Microsoft YaHei',sans-serif;color:#333;background:#fff}.banner{background:linear-gradient(135deg,COLOR,COLORdd);color:#fff;padding:40px;text-align:center}.banner h1{font-size:32px;margin-bottom:10px;letter-spacing:4px}.contact-row{display:flex;justify-content:center;gap:20px;font-size:14px;opacity:0.9}.body{padding:30px 40px}.section{margin-bottom:20px}.section h2{font-size:16px;color:COLOR;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #eee}.section p{line-height:1.8;font-size:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.item{margin-bottom:10px;font-size:14px;line-height:1.6}.item strong{color:#333}.item .time{color:#999;font-size:13px;float:right}.item p{color:#666;margin-top:4px}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:COLOR10;color:COLOR;padding:3px 12px;border-radius:20px;font-size:13px;border:1px solid COLOR30}@media print{.banner{padding:24px}body{padding:0}@page{margin:10mm}}`;

    const timelineHtml = `<div class="resume"><div class="header"><h1>{{name}}</h1><div class="contact">{{phone}} · {{email}} · {{school}} {{major}} {{graduationYear}}</div></div><div class="section"><h2>个人简介</h2><p>{{selfIntro}}</p></div><div class="section"><h2>教育经历</h2><div class="timeline">{{education}}</div></div><div class="section"><h2>工作经历</h2><div class="timeline">{{experience}}</div></div><div class="section"><h2>项目经验</h2><div class="timeline">{{projects}}</div></div><div class="section"><h2>专业技能</h2><div class="skills">{{skills}}</div></div></div>`;
    const timelineCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Microsoft YaHei',sans-serif;color:#333;background:#fff;padding:40px}.resume{max-width:800px;margin:0 auto}.header{margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid COLOR}.header h1{font-size:30px;color:COLOR;margin-bottom:6px}.contact{font-size:14px;color:#666}.section{margin-bottom:22px}.section h2{font-size:16px;color:COLOR;margin-bottom:12px;display:flex;align-items:center;gap:8px}.section h2::before{content:'';width:4px;height:16px;background:COLOR;border-radius:2px}.section p{line-height:1.8;font-size:14px}.timeline{border-left:2px solid COLOR30;padding-left:16px}.item{margin-bottom:12px;position:relative;font-size:14px;line-height:1.6}.item::before{content:'';position:absolute;left:-21px;top:6px;width:10px;height:10px;background:COLOR;border-radius:50%}.item strong{color:#333}.item .time{color:#999;font-size:13px;float:right}.item p{color:#666;margin-top:4px}.skills{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:COLOR10;color:COLOR;padding:3px 12px;border-radius:4px;font-size:13px}@media print{body{padding:20px}@page{margin:15mm}}`;

    return [
      { name: '简约标准', description: '适合大多数岗位的简洁模板，蓝色主题', category: '通用', htmlContent: baseHtml, cssContent: baseCss, sort: 1 },
      { name: '深蓝专业', description: '深蓝色主题，突出技术技能', category: '技术', htmlContent: baseHtml, cssContent: baseCss.replace(/#1677ff/g, '#2f54eb'), sort: 2 },
      { name: '优雅紫色', description: '紫色主题，适合设计与产品岗位', category: '设计', htmlContent: baseHtml, cssContent: baseCss.replace(/#1677ff/g, '#722ed1'), sort: 3 },
      { name: '左栏经典', description: '左右分栏布局，左侧深色侧边栏', category: '通用', htmlContent: leftBarHtml, cssContent: leftBarCss.replace(/COLOR/g, '#2f3542'), sort: 4 },
      { name: '左栏蓝调', description: '蓝色侧边栏，清新现代', category: '技术', htmlContent: leftBarHtml, cssContent: leftBarCss.replace(/COLOR/g, '#0984e3'), sort: 5 },
      { name: '左栏墨绿', description: '墨绿色侧边栏，稳重大气', category: '金融', htmlContent: leftBarHtml, cssContent: leftBarCss.replace(/COLOR/g, '#00695c'), sort: 6 },
      { name: '顶部横幅', description: '顶部渐变色横幅，双栏内容区', category: '通用', htmlContent: topBannerHtml, cssContent: topBannerCss.replace(/COLOR/g, '#1677ff'), sort: 7 },
      { name: '暖色横幅', description: '橙红色横幅，适合市场运营', category: '运营', htmlContent: topBannerHtml, cssContent: topBannerCss.replace(/COLOR/g, '#e17055'), sort: 8 },
      { name: '时间轴', description: '左侧时间线布局，强调经历', category: '通用', htmlContent: timelineHtml, cssContent: timelineCss.replace(/COLOR/g, '#1677ff'), sort: 9 },
      { name: '酒红时间轴', description: '酒红色时间线，适合文科岗位', category: '教育', htmlContent: timelineHtml, cssContent: timelineCss.replace(/COLOR/g, '#a0522d'), sort: 10 },
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

  async optimize(id: number, userId: number) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');

    const arkApiKey = this.configService.get<string>('ARK_API_KEY');
    if (!arkApiKey || arkApiKey === 'your_ark_api_key') {
      return {
        message: 'AI优化功能尚未启用（需配置 ARK_API_KEY）',
        suggestions: this.generateSuggestions(resume.content || {}),
      };
    }

    return {
      message: 'AI优化功能即将上线',
      suggestions: this.generateSuggestions(resume.content || {}),
    };
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
  <div class="section"><h2>自我评价</h2><p>{{selfIntro}}</p></div>
  <div class="section"><h2>教育经历</h2>{{education}}</div>
  <div class="section"><h2>实习/工作经历</h2>{{experience}}</div>
  <div class="section"><h2>项目经验</h2>{{projects}}</div>
  <div class="section"><h2>技能</h2><div class="skills">{{skills}}</div></div>
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
