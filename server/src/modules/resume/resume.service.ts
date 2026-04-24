import { Injectable, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { escapeLike } from '../../common/utils/query.util';
import { ConfigService } from '@nestjs/config';
import * as mammoth from 'mammoth';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PDFParse } = require('pdf-parse');
import { Resume } from './entities/resume.entity';
import { ResumeTemplate } from './entities/resume-template.entity';
import { Job } from '../job/entities/job.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { AiRuntimeService } from '../system/ai-runtime.service';
import { getResumeTemplateSeedData } from './resume-templates';

@Injectable()
export class ResumeService implements OnModuleInit {
  constructor(
    @InjectRepository(Resume) private resumeRepo: Repository<Resume>,
    @InjectRepository(ResumeTemplate) private templateRepo: Repository<ResumeTemplate>,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
    private configService: ConfigService,
    private readonly aiRuntimeService: AiRuntimeService,
  ) {}

  async onModuleInit() {
    await this.resumeRepo
      .createQueryBuilder()
      .update()
      .set({ isDraft: false })
      .where('isDraft = :draft AND content IS NOT NULL', { draft: true })
      .execute()
      .catch(() => {});

    await this.templateRepo.clear();
    const seeds = getResumeTemplateSeedData();
    await this.templateRepo.save(this.templateRepo.create(seeds));
    console.log(`简历模板已重新初始化 (${seeds.length} 个模板)`);
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
        { kw: `%${escapeLike(keyword)}%` },
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
      isDraft: true,
      content: dto.content || this.getDefaultContent(),
    });
    return this.resumeRepo.save(resume);
  }

  async findAll(userId: number) {
    return this.resumeRepo.find({
      where: { userId },
      order: { isDefault: 'DESC', updatedAt: 'DESC' },
      select: ['id', 'title', 'targetPosition', 'version', 'templateId', 'isDefault', 'isDraft', 'filePath', 'createdAt', 'updatedAt'],
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
    if (resume.isDraft) resume.isDraft = false;
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
      title: `${source.title} (Copy)`,
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

  async saveFile(id: number, userId: number, filePath: string, diskPath?: string, locale?: string) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');
    resume.filePath = filePath;

    // Extract text content from the uploaded file
    if (diskPath) {
      try {
        let text = '';
        const ext = diskPath.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') {
          const buf = fs.readFileSync(diskPath);
          const parser = new PDFParse({ data: buf, verbosity: 0 });
          await parser.load();
          const result = await parser.getText();
          text = result.text || '';
        } else if (ext === 'docx') {
          const result = await mammoth.extractRawText({ path: diskPath });
          text = result.value || '';
        }
        if (text.trim()) {
          const parsed = await this.aiParseResumeText(text, locale);
          resume.content = { ...(resume.content || this.getDefaultContent()), ...parsed };
        }
      } catch (e) {
        console.warn('Resume file text extraction failed:', e?.message || e);
      }
    }

    return this.resumeRepo.save(resume);
  }

  private async aiParseResumeText(text: string, locale?: string): Promise<Record<string, any>> {
    // Truncate very long texts to stay within token limits
    const truncated = text.length > 6000 ? text.slice(0, 6000) : text;

    const configured = await this.aiRuntimeService.isConfigured();
    if (!configured) {
      return this.regexParseResumeText(text);
    }

    try {
      const aiResult = await this.aiRuntimeService.chatJson<{
        basicInfo?: { name?: string; phone?: string; email?: string; school?: string; major?: string; graduationYear?: string };
        education?: Array<{ school: string; major: string; startDate: string; endDate: string }>;
        experience?: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>;
        projects?: Array<{ name: string; startDate: string; endDate: string; description: string }>;
        awards?: Array<{ name: string; date: string; description: string }>;
        activities?: Array<{ organization: string; role: string; startDate: string; endDate: string; description: string }>;
        skills?: string[];
        selfIntro?: string;
        jobIntention?: { targetPosition: string; expectedSalary: string; preferredCity: string; workType: string };
      }>({
        scene: 'resume_parse',
        maxTokens: 3000,
        systemPrompt: (locale?.startsWith('en') ? [
          'You are a resume parsing expert. Extract structured information from the resume text provided by the user. Output strict JSON only, no markdown.',
          'JSON structure:',
          '{',
          '  "basicInfo": {"name":"","phone":"","email":"","school":"","major":"","graduationYear":"e.g. 2026"},',
          '  "education": [{"school":"","major":"","startDate":"e.g. 2022.09","endDate":"e.g. 2026.06"}],',
          '  "experience": [{"company":"","position":"","startDate":"e.g. 2025.06","endDate":"e.g. 2025.09","description":""}],',
          '  "projects": [{"name":"","startDate":"","endDate":"","description":""}],',
          '  "awards": [{"name":"","date":"e.g. 2025.06","description":""}],',
          '  "activities": [{"organization":"","role":"","startDate":"","endDate":"","description":""}],',
          '  "skills": ["skill1","skill2"],',
          '  "selfIntro": "",',
          '  "jobIntention": {"targetPosition":"","expectedSalary":"","preferredCity":"","workType":""}',
          '}',
          'Requirements:',
          '1. Extract strictly from the original text. Do NOT invent information. Leave empty strings or empty arrays for missing fields.',
          '2. Dates should use YYYY.MM format (e.g. 2025.06). Year-only is fine as YYYY.',
          '3. Keep original descriptions in full, do not abbreviate.',
          '4. Split skills into individual items (e.g. ["Java","Spring Boot","MySQL"]).',
          '5. All output values MUST be in English. Translate Chinese content to English.',
        ] : [
          '你是一名简历解析专家。请从用户提供的简历原文中提取结构化信息，输出严格 JSON，不要输出 markdown。',
          'JSON 结构如下：',
          '{',
          '  "basicInfo": {"name":"姓名","phone":"手机号","email":"邮箱","school":"学校","major":"专业","graduationYear":"毕业年份如2026"},',
          '  "education": [{"school":"学校名","major":"专业","startDate":"如 2022.09","endDate":"如 2026.06"}],',
          '  "experience": [{"company":"公司名","position":"岗位","startDate":"如 2025.06","endDate":"如 2025.09","description":"工作描述"}],',
          '  "projects": [{"name":"项目名","startDate":"","endDate":"","description":"项目描述"}],',
          '  "awards": [{"name":"奖项/证书名","date":"如 2025.06","description":"说明"}],',
          '  "activities": [{"organization":"组织名","role":"职务","startDate":"","endDate":"","description":"描述"}],',
          '  "skills": ["技能1","技能2"],',
          '  "selfIntro": "个人简介/自我评价",',
          '  "jobIntention": {"targetPosition":"目标岗位","expectedSalary":"","preferredCity":"","workType":""}',
          '}',
          '要求：',
          '1. 严格从原文提取，不要编造不存在的信息，提取不到的字段留空字符串或空数组',
          '2. 日期统一格式为 YYYY.MM（如 2025.06），仅有年份则写 YYYY',
          '3. description 字段保留原文描述，不要缩写或省略',
          '4. skills 拆分为独立技能词（如 ["Java","Spring Boot","MySQL"]），不要合并',
          '5. 所有输出字段值必须使用中文。如果简历原文是英文，请翻译为中文输出。',
        ]).join('\n'),
        userPrompt: truncated,
      });

      // Merge AI result with default structure
      const content = this.getDefaultContent();
      if (aiResult.basicInfo) {
        content.basicInfo = { ...content.basicInfo, ...aiResult.basicInfo };
      }
      if (Array.isArray(aiResult.education) && aiResult.education.length) {
        content.education = aiResult.education;
      }
      if (Array.isArray(aiResult.experience) && aiResult.experience.length) {
        content.experience = aiResult.experience;
      }
      if (Array.isArray(aiResult.projects) && aiResult.projects.length) {
        content.projects = aiResult.projects;
      }
      if (Array.isArray(aiResult.awards) && aiResult.awards.length) {
        content.awards = aiResult.awards;
      }
      if (Array.isArray(aiResult.activities) && aiResult.activities.length) {
        content.activities = aiResult.activities;
      }
      if (Array.isArray(aiResult.skills) && aiResult.skills.length) {
        content.skills = aiResult.skills;
      }
      if (aiResult.selfIntro) content.selfIntro = aiResult.selfIntro;
      if (aiResult.jobIntention) {
        content.jobIntention = { ...(content.jobIntention || {}), ...aiResult.jobIntention };
      }
      return content;
    } catch (e) {
      console.warn('AI resume parsing failed, falling back to regex:', e?.message || e);
      return this.regexParseResumeText(text);
    }
  }

  private regexParseResumeText(text: string): Record<string, any> {
    const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
    const content: Record<string, any> = this.getDefaultContent();

    const phoneMatch = text.match(/(1[3-9]\d{9})/) || text.match(/(\+?\d{2,3}[\s-]?\d{3,4}[\s-]?\d{4})/);
    if (phoneMatch) content.basicInfo.phone = phoneMatch[1];
    const emailMatch = text.match(/([\w.+-]+@[\w-]+\.[\w.]+)/);
    if (emailMatch) content.basicInfo.email = emailMatch[1];

    for (const line of lines.slice(0, 5)) {
      const clean = line.replace(/[\s|·•\-—]/g, '').trim();
      if (clean.length >= 2 && clean.length <= 8 && !/[\d@]/.test(clean)
        && !/^(education|experience|skills|projects|awards|contact|summary|objective|about|work|personal|self|profile)/i.test(clean)
        && !/^(教育|经历|技能|项目|奖|联系|个人|自我|工作|实习|荣誉|证书|活动)/i.test(clean)) {
        content.basicInfo.name = clean;
        break;
      }
    }

    const skillPats = [/(?:skills?|技能|技术栈|专业技能)[：:\s]*([^\n]+)/i, /(?:熟[悉练]|掌握)[：:\s]*([^\n]+)/i];
    for (const pat of skillPats) {
      const m = text.match(pat);
      if (m) content.skills.push(...m[1].split(/[,，、;；|/]/).map(s => s.trim()).filter(s => s && s.length < 30));
    }
    content.skills = [...new Set(content.skills)];

    const eduPat = /(?:university|college|学院|大学|School of)/gi;
    for (const line of lines) {
      if (eduPat.test(line)) {
        const y = line.match(/(20\d{2})/);
        content.education.push({ school: line.replace(/\d{4}[\s\-~至]+\d{4}/, '').trim().slice(0, 60), major: '', startDate: y?.[1] || '', endDate: '' });
        if (content.education.length >= 3) break;
      }
    }

    if (!content.selfIntro && !content.skills.length && !content.education.length) {
      content.selfIntro = lines.slice(0, 30).join('\n').slice(0, 1000);
    }

    return content;
  }

  async getTemplates(page = 1, pageSize = 20, category?: string, keyword?: string) {
    const qb = this.templateRepo.createQueryBuilder('tpl');

    if (category) {
      qb.andWhere('tpl.category = :category', { category });
    }
    if (keyword) {
      qb.andWhere('(tpl.name LIKE :kw OR tpl.description LIKE :kw)', { kw: `%${escapeLike(keyword)}%` });
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

  async analyze(id: number, userId: number, body?: { jobDescription?: string; jobId?: number }) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');

    const content = resume.content || {};
    const completeness = this.calculateCompleteness(content);
    const keywords = this.extractKeywords(content);
    const suggestions = this.generateSuggestions(content);

    // 尝试获取岗位 JD
    let jobDescription = body?.jobDescription || '';
    let jobTitle = '';
    if (!jobDescription && body?.jobId) {
      const job = await this.jobRepo.findOne({ where: { id: body.jobId } });
      if (job) {
        jobDescription = [job.description, job.requirements].filter(Boolean).join('\n');
        jobTitle = job.title;
      }
    }
    if (!jobDescription && resume.targetPosition) {
      jobDescription = resume.targetPosition;
    }

    // 岗位匹配分析
    let jobMatchScore = 0;
    let missingSkills: string[] = [];
    let matchedKeywords: string[] = [];
    let jobMatchSuggestions: string[] = [];

    if (jobDescription) {
      const jdLower = jobDescription.toLowerCase();
      const resumeKeywords = keywords.map(k => k.toLowerCase());
      matchedKeywords = keywords.filter(k => jdLower.includes(k.toLowerCase()));

      // 提取 JD 中的关键技能词
      const jdWords = jobDescription.replace(/[^\w\u4e00-\u9fff+#.]/g, ' ').split(/\s+/).filter(w => w.length > 1);
      const jdUniqueWords = [...new Set(jdWords.map(w => w.toLowerCase()))];
      missingSkills = jdUniqueWords
        .filter(w => !resumeKeywords.includes(w) && w.length > 2)
        .slice(0, 8);

      // 计算匹配度
      const matchRatio = jdUniqueWords.length > 0
        ? resumeKeywords.filter(k => jdUniqueWords.includes(k)).length / Math.max(jdUniqueWords.length, 1)
        : 0;
      jobMatchScore = Math.min(100, Math.round(matchRatio * 100 + completeness * 0.3));

      if (jobMatchScore < 40) {
        jobMatchSuggestions.push('简历与目标岗位匹配度较低，建议根据 JD 补充相关技能和项目经验');
      } else if (jobMatchScore < 70) {
        jobMatchSuggestions.push('简历与岗位有一定匹配，建议进一步突出相关项目经历');
      }
      if (missingSkills.length > 0) {
        jobMatchSuggestions.push(`建议补充以下技能关键词：${missingSkills.slice(0, 5).join('、')}`);
      }
    }

    const score = jobDescription
      ? Math.round(completeness * 0.4 + jobMatchScore * 0.6)
      : completeness;

    let competitivenessLevel = '';
    if (jobDescription) {
      if (score >= 80) competitivenessLevel = '竞争力强';
      else if (score >= 60) competitivenessLevel = '竞争力中等';
      else if (score >= 40) competitivenessLevel = '竞争力偏弱';
      else competitivenessLevel = '竞争力不足';
    }

    const analysis = {
      completeness,
      keywords,
      matchedKeywords,
      suggestions: [...suggestions, ...jobMatchSuggestions],
      score,
      jobMatchScore: jobDescription ? jobMatchScore : null,
      missingSkills: jobDescription ? missingSkills : [],
      jobTitle: jobTitle || null,
      competitiveness: jobDescription ? {
        level: competitivenessLevel,
        score,
        matchedCount: matchedKeywords.length,
        missingCount: missingSkills.length,
        summary: `简历与岗位匹配度 ${jobMatchScore}%，${competitivenessLevel}。匹配关键词 ${matchedKeywords.length} 个，缺失技能 ${missingSkills.length} 个。`,
      } : null,
    };

    resume.analysisResult = JSON.stringify(analysis);
    await this.resumeRepo.save(resume);

    return analysis;
  }

  async optimize(id: number, userId: number, body?: Record<string, any>) {
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
        skills?: string[];
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
          '  "skills": ["技能1","技能2","技能3",...],',
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
          '7. skills 字段：保留用户已有的技能，并根据目标岗位和专业额外推荐 5-8 个相关技能（编程语言、框架、工具、软技能等），总计 8-15 个',
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
      if (Array.isArray(aiResult.skills) && aiResult.skills.length) {
        const merged = new Set([...(Array.isArray(skills) ? skills : []), ...aiResult.skills]);
        updatedContent.skills = Array.from(merged).filter(Boolean);
      } else if (Array.isArray(skills) && skills.length) {
        updatedContent.skills = skills;
      }

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

  async polishSection(id: number, userId: number, body: { section: string; text: string; targetPosition?: string }) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');

    const { section, text, targetPosition } = body;
    if (!text?.trim()) return { original: text, polished: text, suggestions: [] };

    if (await this.aiRuntimeService.isConfigured()) {
      try {
        const result = await this.aiRuntimeService.chatJson<{
          polished?: string;
          suggestions?: string[];
          highlights?: string[];
        }>({
          scene: 'resume_optimize',
          maxTokens: 1200,
          temperature: 0.3,
          systemPrompt: [
            '你是一名资深校招简历润色专家。请对用户提供的简历段落进行润色改写。',
            '输出 JSON：{"polished":"润色后的文本","suggestions":["改进建议1"],"highlights":["亮点关键词1"]}',
            '要求：1. 保持原意，提升表达专业度 2. 添加量化数据（如百分比、数量）3. 使用 STAR 法则组织内容 4. 突出技术关键词',
          ].join('\n'),
          userPrompt: JSON.stringify({ section, text, targetPosition: targetPosition || resume.targetPosition || '' }),
        });
        return {
          original: text,
          polished: result.polished || text,
          suggestions: result.suggestions || [],
          highlights: result.highlights || [],
        };
      } catch { /* fallback */ }
    }

    return {
      original: text,
      polished: text,
      suggestions: [
        '建议添加量化数据来增强说服力',
        '可以使用 STAR 法则（情境-任务-行动-结果）来组织描述',
        '适当加入技术关键词以提升ATS通过率',
      ],
      highlights: [],
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

  async renderResume(id: number, userId: number, locale?: string) {
    const resume = await this.resumeRepo.findOne({ where: { id, userId } });
    if (!resume) throw new NotFoundException('简历不存在');

    const templateId = resume.templateId || 1;
    const template = await this.templateRepo.findOne({ where: { id: templateId } });

    const content = resume.content || this.getDefaultContent();
    const htmlTemplate = template?.htmlContent || '<div class="resume"><h1>{{name}}</h1></div>';
    const css = template?.cssContent || '';

    const renderedHtml = this.injectContentIntoTemplate(htmlTemplate, content, css, locale);
    return { html: renderedHtml };
  }

  async importTemplateFromDocx(filePath: string, name: string) {
    const result = await mammoth.convertToHtml({ path: filePath });
    const htmlContent = result.value;

    const tpl = this.templateRepo.create({
      name,
      description: `从 Word 文档导入`,
      htmlContent: `<div class="resume">${htmlContent}</div>`,
      cssContent: '*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;color:#333;padding:40px}.resume{max-width:800px;margin:0 auto}',
      isSystem: false,
    });

    return this.templateRepo.save(tpl);
  }

  private escapeHtml(str: string): string {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  private buildAvatarDataUri(name: string): string {
    const ch = (name || '').trim().charAt(0) || '?';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="125"><rect width="100" height="125" fill="#2563eb" rx="8"/><text x="50" y="72" font-size="40" fill="#fff" text-anchor="middle" font-family="sans-serif">${ch}</text></svg>`;
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  }

  private sectionLabels(locale?: string): Record<string, string> {
    const isChinese = !locale || !locale.startsWith('en');
    return isChinese
      ? {
          'About Me': '自我介绍', 'Education': '教育经历',
          'Work Experience': '实习/工作经历', 'Projects': '项目经验',
          'Awards & Certificates': '证书/荣誉奖项',
          'Activities': '校园活动/社会实践', 'Skills': '技能', 'Contact': '联系方式',
        }
      : {
          'About Me': 'Self Introduction', 'Education': 'Education',
          'Work Experience': 'Work Experience', 'Projects': 'Projects',
          'Awards & Certificates': 'Awards & Certificates',
          'Activities': 'Activities', 'Skills': 'Skills', 'Contact': 'Contact',
        };
  }

  private injectContentIntoTemplate(
    html: string,
    content: Record<string, any>,
    css: string,
    locale?: string,
  ): string {
    const basic = content.basicInfo || {};
    const job = content.jobIntention || {};
    const skills = Array.isArray(content.skills) ? content.skills : [];
    const education = Array.isArray(content.education) ? content.education : [];
    const experience = Array.isArray(content.experience) ? content.experience : [];
    const projects = Array.isArray(content.projects) ? content.projects : [];
    const awards = Array.isArray(content.awards) ? content.awards : [];
    const activities = Array.isArray(content.activities) ? content.activities : [];
    const esc = (s: string) => this.escapeHtml(s);

    const avatarUrl = basic.avatar || content.avatar || '';
    const avatarSrc = avatarUrl
      ? esc(avatarUrl)
      : this.buildAvatarDataUri(basic.name || '');
    let result = html
      .replace(/\{\{avatar\}\}/g, avatarSrc)
      .replace(/\{\{name\}\}/g, esc(basic.name || ''))
      .replace(/\{\{phone\}\}/g, esc(basic.phone || ''))
      .replace(/\{\{email\}\}/g, esc(basic.email || ''))
      .replace(/\{\{school\}\}/g, esc(basic.school || ''))
      .replace(/\{\{major\}\}/g, esc(basic.major || ''))
      .replace(/\{\{graduationYear\}\}/g, esc(basic.graduationYear || ''))
      .replace(/\{\{targetPosition\}\}/g, esc(job.targetPosition || ''))
      .replace(/\{\{expectedSalary\}\}/g, esc(job.expectedSalary || ''))
      .replace(/\{\{preferredCity\}\}/g, esc(job.preferredCity || ''))
      .replace(/\{\{workType\}\}/g, esc(job.workType || ''))
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

    const labels = this.sectionLabels(locale);
    for (const [en, label] of Object.entries(labels)) {
      const escaped = en.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] || c));
      result = result
        .replace(new RegExp(`<h2>${escaped}</h2>`, 'g'), `<h2>${label}</h2>`)
        .replace(new RegExp(`<h3>${escaped}</h3>`, 'g'), `<h3>${label}</h3>`);
    }

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${result}</body></html>`;
  }

}
