import { Injectable, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { escapeLike } from '../../common/utils/query.util';
import { Interview, InterviewStatus } from './entities/interview.entity';
import { InterviewQuestion } from './entities/interview-question.entity';
import { QuestionBank, QuestionDifficulty, QuestionSource, QuestionReviewStatus } from './entities/question-bank.entity';
import { QuestionCategory } from './entities/question-category.entity';
import { PracticeRecord } from './entities/practice-record.entity';
import { Resume } from '../resume/entities/resume.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { seedQuestions } from './seed-questions-en';
import { AiRuntimeService } from '../system/ai-runtime.service';

@Injectable()
export class InterviewService implements OnModuleInit {
  constructor(
    @InjectRepository(Interview) private interviewRepo: Repository<Interview>,
    @InjectRepository(InterviewQuestion) private iqRepo: Repository<InterviewQuestion>,
    @InjectRepository(QuestionBank) private qbRepo: Repository<QuestionBank>,
    @InjectRepository(QuestionCategory) private qcRepo: Repository<QuestionCategory>,
    @InjectRepository(PracticeRecord) private practiceRepo: Repository<PracticeRecord>,
    @InjectRepository(Resume) private resumeRepo: Repository<Resume>,
    private readonly aiRuntimeService: AiRuntimeService,
  ) {}

  async onModuleInit() {
    // 仅在题库为空时种子化，避免每次启动都清空运行时数据。
    const catCount = await this.qcRepo.count();
    if (catCount === 0) {
      const tech = await this.qcRepo.save(this.qcRepo.create({ name: '技术面试', type: 'type', description: '技术类面试题目', sort: 1 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: '数据结构与算法', parentId: tech.id, type: 'type', sort: 1 },
        { name: '计算机网络', parentId: tech.id, type: 'type', sort: 2 },
        { name: '操作系统', parentId: tech.id, type: 'type', sort: 3 },
        { name: '数据库', parentId: tech.id, type: 'type', sort: 4 },
        { name: '系统设计', parentId: tech.id, type: 'type', sort: 5 },
      ]));

      const behavior = await this.qcRepo.save(this.qcRepo.create({ name: '行为面试', type: 'type', description: '行为与情景类面试题目', sort: 2 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: '自我介绍', parentId: behavior.id, type: 'type', sort: 1 },
        { name: 'STAR 法则', parentId: behavior.id, type: 'type', sort: 2 },
        { name: '职业规划', parentId: behavior.id, type: 'type', sort: 3 },
        { name: '情景模拟', parentId: behavior.id, type: 'type', sort: 4 },
      ]));

      const company = await this.qcRepo.save(this.qcRepo.create({ name: '企业专题', type: 'company', description: '按企业分类的面试题', sort: 3 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: '宝洁八大问', parentId: company.id, type: 'company', sort: 1 },
        { name: '字节跳动', parentId: company.id, type: 'company', sort: 2 },
        { name: '腾讯', parentId: company.id, type: 'company', sort: 3 },
        { name: '阿里巴巴', parentId: company.id, type: 'company', sort: 4 },
      ]));

      await this.qcRepo.save(this.qcRepo.create({ name: '项目经验', type: 'type', description: '项目深度提问', sort: 4 }));
    }

    const qCount = await this.qbRepo.count();
    if (qCount < seedQuestions.length) {
      const cats = await this.qcRepo.find();
      const catMap: Record<string, number> = {};
      for (const c of cats) catMap[c.name] = c.id;

      const existingQuestions = await this.qbRepo.find({ select: ['question'] });
      const existingSet = new Set(existingQuestions.map((q) => q.question));

      const newQuestions = seedQuestions
        .filter((sq) => !existingSet.has(sq.question))
        .map((sq) => ({
          question: sq.question,
          referenceAnswer: sq.referenceAnswer,
          categoryId: catMap[sq.categoryName] || catMap['行为面试'],
          difficulty: sq.difficulty,
          source: QuestionSource.SYSTEM,
          company: sq.company,
          tags: sq.tags,
          questionType: sq.questionType,
          options: sq.options,
        }));

      if (newQuestions.length > 0) {
        await this.qbRepo.save(this.qbRepo.create(newQuestions));
      }

      for (const cat of cats) {
        const count = await this.qbRepo.count({ where: { categoryId: cat.id } });
        await this.qcRepo.update(cat.id, { questionCount: count });
      }

      console.log(`Question bank updated: added ${newQuestions.length} questions, total ${qCount + newQuestions.length}`);
    }
  }

  // ==================== 题库管理 ====================

  async getCategories() {
    const all = await this.qcRepo.find({ order: { sort: 'ASC', id: 'ASC' } });

    // 单条 GROUP BY 查询替代 N 次 count()，避免 N+1 性能问题
    const countRows = await this.qbRepo
      .createQueryBuilder('q')
      .select('q.categoryId', 'categoryId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('q.categoryId')
      .getRawMany();
    const countMap = new Map<number, number>(
      countRows.map((r: any) => [Number(r.categoryId), Number(r.count)]),
    );

    const map = new Map<number, any>();
    const tree: any[] = [];

    for (const cat of all) {
      map.set(cat.id, { ...cat, questionCount: countMap.get(cat.id) || 0, children: [] });
    }

    for (const cat of map.values()) {
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId).children.push(cat);
      } else {
        tree.push(cat);
      }
    }

    return tree;
  }

  async createCategory(data: { name: string; parentId?: number; type?: string; description?: string; sort?: number }) {
    return this.qcRepo.save(this.qcRepo.create(data));
  }

  async updateCategory(id: number, data: Partial<{ name: string; parentId: number; type: string; description: string; sort: number }>) {
    const cat = await this.qcRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('分类不存在');
    Object.assign(cat, data);
    return this.qcRepo.save(cat);
  }

  async deleteCategory(id: number) {
    await this.qcRepo.update({ parentId: id }, { parentId: null as any });
    await this.qcRepo.delete(id);
  }

  async getQuestions(page = 1, pageSize = 10, categoryId?: number, difficulty?: string, keyword?: string, source?: string, questionType?: string, reviewStatus?: string, includeAll = false) {
    const qb = this.qbRepo.createQueryBuilder('q');
    if (reviewStatus) {
      qb.andWhere('q.reviewStatus = :rs', { rs: reviewStatus });
    } else if (!includeAll) {
      qb.andWhere('q.reviewStatus = :rs', { rs: QuestionReviewStatus.APPROVED });
    }
    if (categoryId) {
      const catIds = await this.collectDescendantCategoryIds(categoryId);
      if (catIds.length > 0) {
        qb.andWhere('q.categoryId IN (:...catIds)', { catIds });
      } else {
        qb.andWhere('q.categoryId = :categoryId', { categoryId });
      }
    }
    if (difficulty) qb.andWhere('q.difficulty = :difficulty', { difficulty });
    if (source) qb.andWhere('q.source = :source', { source });
    if (questionType) qb.andWhere('q.questionType = :questionType', { questionType });
    if (keyword) qb.andWhere('(q.question LIKE :kw OR q.company LIKE :kw)', { kw: `%${escapeLike(keyword)}%` });

    qb.orderBy('q.frequency', 'DESC').addOrderBy('q.id', 'DESC')
      .skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async getQuestionTypeStats() {
    const stats = await this.qbRepo.createQueryBuilder('q')
      .select('q.questionType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('q.questionType')
      .getRawMany();
    const result: Record<string, number> = { open: 0, choice: 0, judgment: 0, short_answer: 0 };
    for (const s of stats) result[s.type || 'open'] = Number(s.count);
    return result;
  }

  async createQuestion(dto: CreateQuestionDto, userId?: number) {
    const q = this.qbRepo.create({ ...dto, source: userId ? QuestionSource.USER : QuestionSource.SYSTEM, userId });
    return this.qbRepo.save(q);
  }

  async updateQuestion(id: number, data: Partial<CreateQuestionDto>) {
    const q = await this.qbRepo.findOne({ where: { id } });
    if (!q) throw new NotFoundException('题目不存在');
    Object.assign(q, data);
    return this.qbRepo.save(q);
  }

  async deleteQuestion(id: number) {
    await this.qbRepo.delete(id);
  }

  // ==================== 用户投稿题目 ====================

  async submitUserQuestion(dto: any, userId: number) {
    const q = this.qbRepo.create({
      ...dto,
      userId,
      source: QuestionSource.USER,
      reviewStatus: QuestionReviewStatus.PENDING,
    });
    return this.qbRepo.save(q);
  }

  async getUserSubmittedQuestions(userId: number, page = 1, pageSize = 10) {
    const [list, total] = await this.qbRepo.findAndCount({
      where: { userId, source: QuestionSource.USER },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async reviewQuestion(id: number, status: string, rejectReason?: string) {
    const q = await this.qbRepo.findOne({ where: { id } });
    if (!q) throw new NotFoundException('题目不存在');
    q.reviewStatus = status as QuestionReviewStatus;
    if (status === QuestionReviewStatus.REJECTED && rejectReason) {
      q.rejectReason = rejectReason;
    }
    return this.qbRepo.save(q);
  }

  // ==================== JD 结构化解析 ====================

  async parseJobDescription(jdText: string) {
    if (!jdText?.trim()) {
      return { coreSkills: [], experienceRequirements: [], educationRequirements: '', keyResponsibilities: [], raw: '' };
    }

    if (await this.aiRuntimeService.isConfigured()) {
      try {
        const result = await this.aiRuntimeService.chatJson<{
          coreSkills?: string[];
          experienceRequirements?: string[];
          educationRequirements?: string;
          keyResponsibilities?: string[];
          preferredQualifications?: string[];
        }>({
          scene: 'jd_parse',
          maxTokens: 1200,
          temperature: 0.2,
          systemPrompt: [
            '你是一名专业的岗位 JD 解析专家。请从岗位描述中提取结构化信息，输出严格 JSON。',
            'JSON 格式：{"coreSkills":["技能1","技能2"],"experienceRequirements":["要求1"],"educationRequirements":"学历要求","keyResponsibilities":["职责1"],"preferredQualifications":["加分项1"]}',
          ].join('\n'),
          userPrompt: jdText.slice(0, 3000),
        });
        return { ...result, raw: jdText };
      } catch { /* fallback */ }
    }

    const skills: string[] = [];
    const techKeywords = jdText.match(/(?:熟[悉练]|掌握|了解|精通)\s*([^\n,，。.;；]+)/g) || [];
    for (const m of techKeywords) {
      skills.push(...m.replace(/^(熟[悉练]|掌握|了解|精通)\s*/, '').split(/[,，、/]/));
    }

    return {
      coreSkills: [...new Set(skills.map(s => s.trim()).filter(Boolean))].slice(0, 15),
      experienceRequirements: [],
      educationRequirements: jdText.match(/(本科|硕士|博士|大专|学士|研究生)/)?.[0] || '',
      keyResponsibilities: [],
      preferredQualifications: [],
      raw: jdText,
    };
  }

  // ==================== 模拟面试 ====================

  /** 题量边界，避免前端传入异常值。 */
  private clampTargetQuestionCount(input?: number): number {
    const n = Number(input);
    if (!Number.isFinite(n)) return 5;
    return Math.min(15, Math.max(1, Math.round(n)));
  }

  async startInterview(userId: number, dto: StartInterviewDto, locale: string = 'zh-CN') {
    let resumeContent: Record<string, any> | null = null;
    if (dto.resumeId) {
      const resume = await this.resumeRepo.findOne({ where: { id: dto.resumeId } });
      if (!resume || resume.userId !== userId) {
        throw new ForbiddenException('无权使用此简历');
      }
      resumeContent = resume.content as Record<string, any> || null;
    }

    // 解析所选分类的层级名称，作为 AI 出题依据或题库兜底条件。
    let categoryName: string | undefined;
    let categoryPath: string | undefined;
    if (dto.categoryId) {
      const cat = await this.qcRepo.findOne({ where: { id: dto.categoryId } });
      if (cat) {
        categoryName = cat.name;
        if (cat.parentId) {
          const parent = await this.qcRepo.findOne({ where: { id: cat.parentId } });
          categoryPath = parent ? `${parent.name} / ${cat.name}` : cat.name;
        } else {
          categoryPath = cat.name;
        }
      }
    }

    const targetCount = this.clampTargetQuestionCount(dto.questionCount);
    const isEn = this.isEnglishLocale(locale);

    const interview = this.interviewRepo.create({
      userId,
      jobTitle: dto.jobTitle,
      jobDescription: dto.jobDescription,
      resumeId: dto.resumeId,
      questionCount: targetCount,
      questionStrategy: {
        mode: 'conversational',
        categoryId: dto.categoryId,
        categoryName,
        categoryPath,
        targetCount,
        locale,
      },
    });
    const saved = await this.interviewRepo.save(interview);

    const introText = isEn
      ? `Hello! I'm your AI interviewer today. Welcome to this ${dto.jobTitle || 'mock interview'} session. Before we dive into the questions, could you please introduce yourself? Tell me about your background, skills, and what you're looking for.`
      : `你好！我是你今天的 AI 面试官，欢迎参加本次${dto.jobTitle ? `「${dto.jobTitle}」` : ''}模拟面试。在进入正式问题之前，请先做个自我介绍，简单谈谈你的背景、技能以及本次面试的期望。`;

    const introQ = this.iqRepo.create({
      interviewId: saved.id,
      orderIndex: 1,
      question: introText,
      questionType: 'introduction',
      questionSource: 'system',
    });
    await this.iqRepo.save(introQ);

    return this.getInterviewDetail(saved.id, userId);
  }

  /** 当 AI 不可用时，从题库根据分类兜底取一道未问过的题。 */
  private async pickQuestionFromBank(interview: Interview, askedTexts: Set<string>): Promise<string | null> {
    const strategy = (interview.questionStrategy || {}) as Record<string, any>;
    const categoryId = strategy.categoryId as number | undefined;
    if (!categoryId) return null;
    const catIds = await this.collectDescendantCategoryIds(categoryId);
    if (!catIds.length) return null;
    const candidates = await this.qbRepo.createQueryBuilder('q')
      .where('q.categoryId IN (:...catIds)', { catIds })
      .andWhere('q.reviewStatus = :st OR q.source = :sys', { st: QuestionReviewStatus.APPROVED, sys: QuestionSource.SYSTEM })
      .orderBy('RAND()')
      .limit(20)
      .getMany();
    for (const q of candidates) {
      if (!askedTexts.has(q.question)) return q.question;
    }
    return null;
  }

  private async generateNextQuestion(interview: Interview, allQs: InterviewQuestion[]): Promise<{ text: string; source: string } | null> {
    const askedTexts = new Set(allQs.map(q => q.question));
    const strategy = (interview.questionStrategy || {}) as Record<string, any>;
    const categoryHint = strategy.categoryPath || strategy.categoryName || '';

    if (!await this.aiRuntimeService.isConfigured()) {
      const fallback = await this.pickQuestionFromBank(interview, askedTexts);
      return fallback ? { text: fallback, source: 'bank' } : null;
    }

    let resumeSummary = '';
    if (interview.resumeId) {
      const resume = await this.resumeRepo.findOne({ where: { id: interview.resumeId }, select: ['content'] });
      if (resume?.content) {
        const c = resume.content as Record<string, any>;
        const skills = Array.isArray(c.skills) ? c.skills.join(', ') : '';
        const projects = Array.isArray(c.projects)
          ? c.projects.map((p: any) => `${p.name || ''}: ${(p.description || '').slice(0, 100)}`).join('; ')
          : '';
        const edu = Array.isArray(c.education)
          ? c.education.map((e: any) => `${e.school || ''} ${e.major || ''}`).join(', ')
          : '';
        resumeSummary = `Resume - Skills: ${skills}. Education: ${edu}. Projects: ${projects}.`;
      }
    }

    const history = allQs
      .filter(q => q.isAnswered)
      .map(q => `Interviewer: ${q.question}\nCandidate: ${q.answer}`)
      .join('\n---\n');

    const targetCount = this.clampTargetQuestionCount(strategy.targetCount ?? interview.questionCount);
    const remaining = Math.max(0, targetCount - allQs.length);
    const interviewLocale = (strategy.locale as string) || 'zh-CN';
    const isEn = this.isEnglishLocale(interviewLocale);

    try {
      const result = await this.aiRuntimeService.chatJson<{ question?: string; comment?: string }>({
        scene: 'interview_generate',
        maxTokens: 600,
        temperature: 0.8,
        systemPrompt: isEn
          ? `You are a professional interviewer conducting a ${interview.jobTitle || 'mock'} interview${categoryHint ? ` focused on ${categoryHint}` : ''}. Based on the candidate's resume, the job description, and the conversation history, generate the NEXT interview question IN ENGLISH. Briefly comment on the previous answer (1 sentence) and then ask ONE new question, combined naturally. Output strict JSON: {"question":"<comment + next question>"}. The interview targets ${targetCount} questions in total; about ${remaining} remain. If no further question is needed, output {"question":""}. NEVER repeat questions already asked.`
          : `你是一名专业面试官，正在进行${interview.jobTitle ? `「${interview.jobTitle}」` : ''}面试${categoryHint ? `，侧重${categoryHint}` : ''}。请根据候选人的简历、岗位 JD 和对话历史，生成下一道面试题。先用一句话点评上一个回答，再提出一个新问题，自然拼接。输出严格 JSON：{"question":"<点评 + 下一个问题>"}。面试预计共 ${targetCount} 题，还剩 ${remaining} 题。若不需要再问，输出 {"question":""}。所有问题必须中文，不要重复已问过的题。`,
        userPrompt: `Focus area: ${categoryHint || 'general'}\n${resumeSummary ? resumeSummary + '\n\n' : ''}Job: ${interview.jobTitle || 'General'}\nJob Description: ${(interview.jobDescription || '').slice(0, 1200)}\n\nConversation:\n${history}`,
      });
      const text = result.question?.trim();
      if (text && !askedTexts.has(text)) return { text, source: 'ai_followup' };
    } catch { /* fall through to bank */ }

    const fallback = await this.pickQuestionFromBank(interview, askedTexts);
    return fallback ? { text: fallback, source: 'bank' } : null;
  }

  async getInterviews(userId: number, page = 1, pageSize = 10) {
    const [list, total] = await this.interviewRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page: +page, pageSize: +pageSize };
  }

  /** 用户侧面试总览：直接基于全表聚合，不依赖分页列表。 */
  async getUserInterviewOverview(userId: number) {
    const [total, completed, inProgress, abandoned, avgRow] = await Promise.all([
      this.interviewRepo.count({ where: { userId } }),
      this.interviewRepo.count({ where: { userId, status: InterviewStatus.COMPLETED } }),
      this.interviewRepo.count({ where: { userId, status: InterviewStatus.IN_PROGRESS } }),
      this.interviewRepo.count({ where: { userId, status: InterviewStatus.ABANDONED } }),
      this.interviewRepo
        .createQueryBuilder('i')
        .select('AVG(i.totalScore)', 'avg')
        .where('i.userId = :userId AND i.status = :st AND i.totalScore > 0', { userId, st: InterviewStatus.COMPLETED })
        .getRawOne<{ avg: string | null }>(),
    ]);
    return {
      total,
      completed,
      inProgress,
      abandoned,
      avgScore: Math.round(Number(avgRow?.avg) || 0),
    };
  }

  async getAllInterviewsAdmin(page = 1, pageSize = 10, keyword?: string, status?: string) {
    const qb = this.interviewRepo.createQueryBuilder('i')
      .leftJoinAndSelect('i.user', 'user');
    if (keyword) {
      qb.andWhere('(i.jobTitle LIKE :kw OR user.username LIKE :kw OR user.nickname LIKE :kw)', { kw: `%${escapeLike(keyword)}%` });
    }
    if (status) {
      qb.andWhere('i.status = :st', { st: status });
    }
    qb.orderBy('i.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async getInterviewDetailAdmin(id: number) {
    const interview = await this.interviewRepo.findOne({
      where: { id },
      relations: ['questions', 'user'],
    });
    if (!interview) throw new NotFoundException('面试记录不存在');
    if (interview.questions) {
      interview.questions.sort((a, b) => a.orderIndex - b.orderIndex);
    }

    let resume: Pick<Resume, 'id' | 'title' | 'targetPosition' | 'content'> | null = null;
    if (interview.resumeId) {
      resume = await this.resumeRepo.findOne({
        where: { id: interview.resumeId },
        select: ['id', 'title', 'targetPosition', 'content'],
      });
    }

    return { ...interview, resume };
  }

  async deleteInterviewAdmin(id: number) {
    const interview = await this.interviewRepo.findOne({ where: { id } });
    if (!interview) throw new NotFoundException('面试记录不存在');
    await this.interviewRepo.remove(interview);
    return { message: '删除成功' };
  }

  async getInterviewStats() {
    const total = await this.interviewRepo.count();
    const completed = await this.interviewRepo.count({ where: { status: InterviewStatus.COMPLETED } });
    const inProgress = await this.interviewRepo.count({ where: { status: InterviewStatus.IN_PROGRESS } });
    const avgScore = await this.interviewRepo
      .createQueryBuilder('i')
      .select('AVG(i.totalScore)', 'avg')
      .where('i.status = :st AND i.totalScore > 0', { st: InterviewStatus.COMPLETED })
      .getRawOne();
    return { total, completed, inProgress, avgScore: Math.round(avgScore?.avg || 0) };
  }

  async getInterviewDetail(id: number, userId: number) {
    const interview = await this.interviewRepo.findOne({
      where: { id, userId },
      relations: ['questions'],
    });
    if (!interview) throw new NotFoundException('面试记录不存在');
    if (interview.questions) {
      interview.questions.sort((a, b) => a.orderIndex - b.orderIndex);
    }

    let resume: any = null;
    if (interview.resumeId) {
      resume = await this.resumeRepo.findOne({
        where: { id: interview.resumeId },
        select: ['id', 'title', 'targetPosition', 'content'],
      });
    }

    return { ...interview, resume };
  }

  async submitAnswer(interviewId: number, questionId: number, userId: number, dto: SubmitAnswerDto, locale: string = 'zh-CN') {
    const interview = await this.interviewRepo.findOne({ where: { id: interviewId, userId } });
    if (!interview) throw new NotFoundException('面试记录不存在');
    if (interview.status === InterviewStatus.COMPLETED) {
      throw new ForbiddenException('该面试已结束，无法继续作答');
    }
    if (interview.status === InterviewStatus.ABANDONED) {
      throw new ForbiddenException('该面试已放弃，无法继续作答');
    }

    const question = await this.iqRepo.findOne({ where: { id: questionId, interviewId } });
    if (!question) throw new NotFoundException('题目不存在');
    if (question.isAnswered) {
      throw new ForbiddenException('该题目已作答，请勿重复提交');
    }

    const { score, dimensionScores, feedback } = await this.evaluateAnswer(dto.answer, question.question, question.referenceAnswer, locale);

    question.answer = dto.answer;
    question.answerType = dto.answerType || 'text';
    if (dto.voiceUrl) question.voiceUrl = dto.voiceUrl;
    if (dto.voiceDuration) question.voiceDuration = dto.voiceDuration;
    question.score = score;
    question.dimensionScores = dimensionScores;
    question.feedback = feedback;
    question.isAnswered = true;
    await this.iqRepo.save(question);

    interview.answeredCount = await this.iqRepo.count({ where: { interviewId, isAnswered: true } });

    const strategy = (interview.questionStrategy || {}) as Record<string, any>;
    const targetCount = this.clampTargetQuestionCount(strategy.targetCount ?? interview.questionCount);

    let followUp: { id: number; question: string; orderIndex: number } | null = null;

    const unanswered = await this.iqRepo.count({ where: { interviewId, isAnswered: false } });
    const allQsBeforeFollowUp = await this.iqRepo.find({ where: { interviewId }, order: { orderIndex: 'ASC' } });
    if (unanswered === 0 && allQsBeforeFollowUp.length < targetCount) {
      const next = await this.generateNextQuestion(interview, allQsBeforeFollowUp);
      if (next) {
        const nextOrder = allQsBeforeFollowUp.length + 1;
        const newQ = this.iqRepo.create({
          interviewId,
          orderIndex: nextOrder,
          question: next.text,
          questionType: 'followup',
          questionSource: next.source,
        });
        const savedQ = await this.iqRepo.save(newQ);
        followUp = { id: savedQ.id, question: savedQ.question, orderIndex: savedQ.orderIndex };
      }
    }

    if (unanswered === 0 && !followUp) {
      interview.status = InterviewStatus.COMPLETED;
      const allQuestions = await this.iqRepo.find({ where: { interviewId } });
      const totalScore = allQuestions.reduce((sum, q) => sum + q.score, 0);
      interview.totalScore = Math.round(totalScore / allQuestions.length);
      interview.dimensionScores = this.aggregateDimensionScores(allQuestions);
      interview.overallFeedback = this.generateOverallFeedback(interview.totalScore, interview.dimensionScores, locale);
    }

    await this.interviewRepo.save(interview);
    return { ...question, followUp };
  }

  async endInterview(interviewId: number, userId: number, locale: string = 'zh-CN') {
    const interview = await this.interviewRepo.findOne({ where: { id: interviewId, userId } });
    if (!interview) throw new NotFoundException('面试记录不存在');
    if (interview.status === InterviewStatus.COMPLETED) return interview;

    interview.status = InterviewStatus.COMPLETED;
    const allQuestions = await this.iqRepo.find({ where: { interviewId } });
    const answered = allQuestions.filter(q => q.isAnswered);
    if (answered.length > 0) {
      const totalScore = answered.reduce((sum, q) => sum + q.score, 0);
      interview.totalScore = Math.round(totalScore / answered.length);
      interview.dimensionScores = this.aggregateDimensionScores(answered);
      interview.overallFeedback = this.generateOverallFeedback(interview.totalScore, interview.dimensionScores, locale);
    }
    return this.interviewRepo.save(interview);
  }

  async deleteInterview(id: number, userId: number) {
    const interview = await this.interviewRepo.findOne({ where: { id, userId } });
    if (!interview) throw new NotFoundException('面试记录不存在');
    await this.interviewRepo.remove(interview);
  }

  private async collectDescendantCategoryIds(rootId: number): Promise<number[]> {
    const root = await this.qcRepo.findOne({ where: { id: rootId } });
    if (!root) return [];
    const all = await this.qcRepo.find();
    const childrenMap = new Map<number, number[]>();
    for (const c of all) {
      if (c.parentId != null) {
        if (!childrenMap.has(c.parentId)) childrenMap.set(c.parentId, []);
        childrenMap.get(c.parentId)!.push(c.id);
      }
    }
    const out: number[] = [];
    const dfs = (id: number) => {
      out.push(id);
      for (const cid of childrenMap.get(id) || []) dfs(cid);
    };
    dfs(rootId);
    return out;
  }

  async getRadarData(userId: number) {
    const interviews = await this.interviewRepo.find({
      where: { userId, status: InterviewStatus.COMPLETED },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const dimensions = ['内容完整性', '逻辑性', '专业性', '表达能力', '创新思维'];
    const avg: Record<string, number> = {};
    for (const d of dimensions) avg[d] = 0;

    let count = 0;
    for (const interview of interviews) {
      if (interview.dimensionScores) {
        count++;
        for (const d of dimensions) {
          avg[d] += interview.dimensionScores[d] || 0;
        }
      }
    }

    if (count > 0) {
      for (const d of dimensions) avg[d] = Math.round(avg[d] / count);
    }

    return { dimensions, scores: avg, interviewCount: interviews.length };
  }

  /** 识别是否为英文 locale（默认中文）。 */
  private isEnglishLocale(locale?: string): boolean {
    if (!locale) return false;
    const lc = locale.toLowerCase();
    return lc.startsWith('en');
  }

  /** 中英文维度名映射，仅用于展示。 */
  private localizeDimensionName(name: string, locale?: string): string {
    if (!this.isEnglishLocale(locale)) return name;
    const map: Record<string, string> = {
      '内容完整性': 'Completeness',
      '逻辑性': 'Logic',
      '专业性': 'Professionalism',
      '表达能力': 'Expression',
      '创新思维': 'Innovation',
    };
    return map[name] || name;
  }

  private async evaluateAnswer(answer: string, question: string, referenceAnswer?: string, locale: string = 'zh-CN'): Promise<{
    score: number;
    dimensionScores: Record<string, number>;
    feedback: string;
  }> {
    const isEn = this.isEnglishLocale(locale);
    if (await this.aiRuntimeService.isConfigured()) {
      try {
        const aiResult = await this.aiRuntimeService.chatJson<{
          score?: number;
          dimensionScores?: Record<string, number>;
          feedback?: string;
        }>({
          scene: 'interview_score',
          maxTokens: 1200,
          temperature: 0.2,
          systemPrompt: isEn
            ? [
                'You are a strict but professional campus interviewer.',
                'Grade the candidate answer based on the question and reference answer.',
                'Output JSON only, no markdown.',
                'JSON shape MUST be: {"score":86,"dimensionScores":{"内容完整性":80,"逻辑性":88,"专业性":90,"表达能力":84,"创新思维":78},"feedback":"At most three short paragraphs of feedback IN ENGLISH."}',
                'Keep the dimension keys in Chinese exactly as shown (used as storage keys), but ALL feedback prose MUST be in English.',
                'All scores are integers in 0-100.',
              ].join('\n')
            : [
                '你是一名严格但专业的校园面试官。',
                '请根据题目、参考答案和候选人回答进行评分。',
                '输出 JSON，不要输出 markdown。',
                'JSON 格式必须为：{"score":86,"dimensionScores":{"内容完整性":80,"逻辑性":88,"专业性":90,"表达能力":84,"创新思维":78},"feedback":"三段以内中文反馈"}',
                '所有分数取 0-100 的整数。',
              ].join('\n'),
          userPrompt: JSON.stringify({
            question,
            referenceAnswer: referenceAnswer || '',
            answer,
          }),
        });

        if (aiResult && aiResult.dimensionScores && typeof aiResult.feedback === 'string') {
          const dimensionScores = this.normalizeDimensionScores(aiResult.dimensionScores);
          const score = this.normalizeScore(
            typeof aiResult.score === 'number'
              ? aiResult.score
              : Math.round(Object.values(dimensionScores).reduce((sum, value) => sum + value, 0) / 5),
          );
          return {
            score,
            dimensionScores,
            feedback: aiResult.feedback.trim() || (isEn ? 'AI grading completed.' : 'AI 已完成评分'),
          };
        }
      } catch {
        // AI 不可用时自动回退到规则评分，避免答题流程中断。
      }
    }

    return this.evaluateAnswerRuleBased(answer, referenceAnswer, locale);
  }

  private evaluateAnswerRuleBased(answer: string, referenceAnswer?: string, locale: string = 'zh-CN'): {
    score: number;
    dimensionScores: Record<string, number>;
    feedback: string;
  } {
    const isEn = this.isEnglishLocale(locale);
    const answerLen = answer.length;

    const completeness = Math.min(100, Math.round(answerLen / 3));
    const logic = answerLen > 100 ? Math.min(90, 50 + Math.round(answerLen / 10)) : Math.round(answerLen / 2);
    const professionalism = referenceAnswer ? this.calculateSimilarity(answer, referenceAnswer) : Math.min(70, answerLen / 4);
    const expression = answerLen > 50 ? Math.min(85, 40 + Math.round(answerLen / 8)) : Math.round(answerLen * 0.8);
    const uniqueWords = new Set(answer.replace(/[^\w\u4e00-\u9fff]/g, ' ').split(/\s+/).filter(Boolean));
    const innovation = Math.min(85, Math.round(uniqueWords.size * 1.5) + (answerLen > 200 ? 20 : 0));

    const dimensionScores = {
      '内容完整性': Math.round(completeness),
      '逻辑性': Math.round(logic),
      '专业性': Math.round(professionalism),
      '表达能力': Math.round(expression),
      '创新思维': Math.round(innovation),
    };

    const score = Math.round(Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 5);

    const suggestions: string[] = [];
    if (isEn) {
      if (completeness < 60) suggestions.push('The answer is not detailed enough. Add more concrete examples and specifics.');
      if (logic < 60) suggestions.push('Consider using the STAR framework (Situation-Task-Action-Result) to organize your answer.');
      if (professionalism < 60) suggestions.push('Include more domain terms and technical detail to demonstrate expertise.');
      if (expression < 60) suggestions.push('Make your phrasing smoother and practice spoken delivery.');
      if (suggestions.length === 0) suggestions.push('Solid answer overall. Try adding more quantitative data to strengthen impact.');
    } else {
      if (completeness < 60) suggestions.push('回答内容不够充实，建议补充更多细节和具体案例');
      if (logic < 60) suggestions.push('建议使用 STAR 法则（情境-任务-行动-结果）组织回答');
      if (professionalism < 60) suggestions.push('可以加入更多专业术语和技术细节来体现专业度');
      if (expression < 60) suggestions.push('表达可以更加流畅，建议多练习口语表达');
      if (suggestions.length === 0) suggestions.push('回答较为完整，继续保持！可以尝试加入更多量化数据来增强说服力');
    }

    const refLabel = isEn ? 'Reference answer:' : '参考答案：';
    const scoreLabel = isEn ? 'Score' : '评分';
    const feedback = `${scoreLabel}：${score}/100\n\n${suggestions.join('\n\n')}${referenceAnswer ? '\n\n' + refLabel + referenceAnswer : ''}`;

    return { score, dimensionScores, feedback };
  }

  private calculateSimilarity(answer: string, reference: string): number {
    const aWords = new Set(answer.split(/\s+/));
    const rWords = new Set(reference.split(/\s+/));
    let common = 0;
    for (const w of aWords) {
      if (rWords.has(w)) common++;
    }
    return Math.min(90, Math.round((common / Math.max(rWords.size, 1)) * 100));
  }

  private aggregateDimensionScores(questions: InterviewQuestion[]): Record<string, number> {
    const dimensions = ['内容完整性', '逻辑性', '专业性', '表达能力', '创新思维'];
    const result: Record<string, number> = {};
    for (const d of dimensions) {
      const scores = questions.filter(q => q.dimensionScores?.[d]).map(q => q.dimensionScores[d]);
      result[d] = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    }
    return result;
  }

  private normalizeDimensionScores(raw: Record<string, number>) {
    const dimensions = ['内容完整性', '逻辑性', '专业性', '表达能力', '创新思维'];
    const normalized: Record<string, number> = {};
    for (const key of dimensions) {
      normalized[key] = this.normalizeScore(raw?.[key] ?? 0);
    }
    return normalized;
  }

  private normalizeScore(value: number) {
    const safe = Number.isFinite(value) ? Math.round(value) : 0;
    return Math.max(0, Math.min(100, safe));
  }

  private generateOverallFeedback(score: number, dimensions: Record<string, number>, locale: string = 'zh-CN'): string {
    const isEn = this.isEnglishLocale(locale);
    let level: string;
    if (isEn) {
      level = 'Needs improvement';
      if (score >= 80) level = 'Excellent';
      else if (score >= 60) level = 'Good';
      else if (score >= 40) level = 'Fair';
    } else {
      level = '需要加强';
      if (score >= 80) level = '表现优秀';
      else if (score >= 60) level = '表现良好';
      else if (score >= 40) level = '有待提高';
    }

    const strongest = Object.entries(dimensions).sort((a, b) => b[1] - a[1])[0];
    const weakest = Object.entries(dimensions).sort((a, b) => a[1] - b[1])[0];

    const strongestName = this.localizeDimensionName(strongest[0], locale);
    const weakestName = this.localizeDimensionName(weakest[0], locale);

    if (isEn) {
      return `Overall: ${level} (${score} pts)\n\nStrongest dimension: ${strongestName} (${strongest[1]} pts)\nWeakest dimension: ${weakestName} (${weakest[1]} pts)\n\nKeep practicing, focus on improving ${weakestName}.`;
    }
    return `总体评价：${level}（${score}分）\n\n优势维度：${strongestName}（${strongest[1]}分）\n待提高维度：${weakestName}（${weakest[1]}分）\n\n建议持续练习，重点提升${weakestName}方面的表现。`;
  }

  // ==================== 题库练习 ====================

  async practiceQuestion(questionId: number, answer: string, userId: number, locale: string = 'zh-CN') {
    const question = await this.qbRepo.findOne({ where: { id: questionId } });
    if (!question) throw new NotFoundException('题目不存在');

    const isEn = this.isEnglishLocale(locale);
    let score: number;
    let dimensionScores: Record<string, number>;
    let feedback: string;
    let isCorrect: boolean | null = null;

    if (question.questionType === 'choice' || question.questionType === 'judgment') {
      const correctOption = question.options?.find(o => o.isCorrect);
      isCorrect = correctOption ? answer === correctOption.value : false;
      score = isCorrect ? 100 : 0;
      dimensionScores = { accuracy: score };
      if (isCorrect) {
        feedback = isEn ? 'Correct! Well done.' : '回答正确，做得好！';
      } else {
        const correct = correctOption?.label || question.referenceAnswer;
        feedback = isEn ? `Incorrect. The correct answer is: ${correct}` : `回答错误。正确答案是：${correct}`;
      }
    } else {
      const result = await this.evaluateAnswer(answer, question.question, question.referenceAnswer, locale);
      score = result.score;
      dimensionScores = result.dimensionScores;
      feedback = result.feedback;
    }

    const record = this.practiceRepo.create({
      userId, questionId, answer, score, dimensionScores, feedback,
    });
    await this.practiceRepo.save(record);

    return { id: record.id, score, dimensionScores, feedback, isCorrect };
  }

  async getPracticeHistory(userId: number, page = 1, pageSize = 20) {
    const [list, total] = await this.practiceRepo.findAndCount({
      where: { userId },
      relations: ['question'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total };
  }

  async getPracticeStats(userId: number) {
    const records = await this.practiceRepo.find({ where: { userId } });
    const totalPracticed = records.length;
    const uniqueQuestions = new Set(records.map(r => r.questionId)).size;
    const avgScore = totalPracticed > 0
      ? Math.round(records.reduce((s, r) => s + r.score, 0) / totalPracticed)
      : 0;
    const bestScore = totalPracticed > 0 ? Math.max(...records.map(r => r.score)) : 0;
    return { totalPracticed, uniqueQuestions, avgScore, bestScore };
  }

  async getPracticeRecordsAdmin(page = 1, pageSize = 20, keyword?: string) {
    const qb = this.practiceRepo.createQueryBuilder('pr')
      .leftJoinAndSelect('pr.user', 'user')
      .leftJoinAndSelect('pr.question', 'question')
      .orderBy('pr.createdAt', 'DESC');
    if (keyword?.trim()) {
      qb.andWhere(
        '(user.username LIKE :kw OR user.nickname LIKE :kw OR question.question LIKE :kw)',
        { kw: `%${keyword.trim()}%` },
      );
    }
    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { list, total };
  }

  async getPracticeStatsAdmin() {
    const total = await this.practiceRepo.count();
    const users = await this.practiceRepo
      .createQueryBuilder('pr')
      .select('COUNT(DISTINCT pr.userId)', 'count')
      .getRawOne();
    const avgResult = await this.practiceRepo
      .createQueryBuilder('pr')
      .select('AVG(pr.score)', 'avg')
      .getRawOne();
    return {
      totalRecords: total,
      totalUsers: parseInt(users?.count || '0', 10),
      avgScore: Math.round(parseFloat(avgResult?.avg || '0')),
    };
  }

  async deletePracticeRecord(id: number) {
    await this.practiceRepo.delete(id);
    return { success: true };
  }
}
