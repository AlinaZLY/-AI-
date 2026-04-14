import { Injectable, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview, InterviewStatus } from './entities/interview.entity';
import { InterviewQuestion } from './entities/interview-question.entity';
import { QuestionBank, QuestionDifficulty, QuestionSource, QuestionReviewStatus } from './entities/question-bank.entity';
import { QuestionCategory } from './entities/question-category.entity';
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
    @InjectRepository(Resume) private resumeRepo: Repository<Resume>,
    private readonly aiRuntimeService: AiRuntimeService,
  ) {}

  async onModuleInit() {
    // Force re-seed: clear old data and re-populate with English seed data
    const existingQ = await this.qbRepo.count();
    if (existingQ > 0) {
      await this.qbRepo.clear();
      await this.qcRepo.clear();
      console.log(`Cleared ${existingQ} old questions for English re-seed`);
    }

    const catCount = await this.qcRepo.count();
    if (catCount === 0) {
      const tech = await this.qcRepo.save(this.qcRepo.create({ name: 'Technical Interview', type: 'type', description: 'Technical interview questions', sort: 1 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: 'Data Structures & Algorithms', parentId: tech.id, type: 'type', sort: 1 },
        { name: 'Computer Networks', parentId: tech.id, type: 'type', sort: 2 },
        { name: 'Operating Systems', parentId: tech.id, type: 'type', sort: 3 },
        { name: 'Database', parentId: tech.id, type: 'type', sort: 4 },
        { name: 'System Design', parentId: tech.id, type: 'type', sort: 5 },
      ]));

      const behavior = await this.qcRepo.save(this.qcRepo.create({ name: 'Behavioral Interview', type: 'type', description: 'Behavioral and situational questions', sort: 2 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: 'Self Introduction', parentId: behavior.id, type: 'type', sort: 1 },
        { name: 'STAR Method', parentId: behavior.id, type: 'type', sort: 2 },
        { name: 'Career Planning', parentId: behavior.id, type: 'type', sort: 3 },
        { name: 'Scenario Simulation', parentId: behavior.id, type: 'type', sort: 4 },
      ]));

      const company = await this.qcRepo.save(this.qcRepo.create({ name: 'Company Topics', type: 'company', description: 'Interview questions by company', sort: 3 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: 'P&G Eight Questions', parentId: company.id, type: 'company', sort: 1 },
        { name: 'ByteDance', parentId: company.id, type: 'company', sort: 2 },
        { name: 'Tencent', parentId: company.id, type: 'company', sort: 3 },
        { name: 'Alibaba', parentId: company.id, type: 'company', sort: 4 },
      ]));

      await this.qcRepo.save(this.qcRepo.create({ name: 'Project Experience', type: 'type', description: 'Project deep-dive questions', sort: 4 }));
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
          categoryId: catMap[sq.categoryName] || catMap['Behavioral Interview'],
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
    if (keyword) qb.andWhere('(q.question LIKE :kw OR q.company LIKE :kw)', { kw: `%${keyword}%` });

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

  // ==================== 模拟面试 ====================

  async startInterview(userId: number, dto: StartInterviewDto) {
    let resumeContent: Record<string, any> | null = null;
    if (dto.resumeId) {
      const resume = await this.resumeRepo.findOne({ where: { id: dto.resumeId } });
      if (!resume || resume.userId !== userId) {
        throw new ForbiddenException('无权使用此简历');
      }
      resumeContent = resume.content as Record<string, any> || null;
    }
    const totalCount = dto.questionCount || 5;
    const strategy: Record<string, any> = { bankCount: 0, jdCustomCount: 0, resumeFollowupCount: 0 };

    // ========== 基础层：从题库按分类/难度筛题 ==========
    const bankCount = Math.max(2, totalCount - 2); // 留 2 个位置给增强层
    let bankQuestions: QuestionBank[] = [];

    const qb = this.qbRepo.createQueryBuilder('q');
    if (dto.categoryId != null) {
      const catIds = await this.collectDescendantCategoryIds(dto.categoryId);
      if (catIds.length > 0) {
        qb.andWhere('q.categoryId IN (:...catIds)', { catIds });
      }
    }
    // 如果有 JD，优先选与 JD 相关的题
    if (dto.jobDescription) {
      const jdKeywords = dto.jobDescription
        .replace(/[^\w\u4e00-\u9fff]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2)
        .slice(0, 10);
      if (jdKeywords.length > 0) {
        const conditions = jdKeywords.map((_, i) => `q.question LIKE :kw${i}`).join(' OR ');
        const params: Record<string, string> = {};
        jdKeywords.forEach((kw, i) => { params[`kw${i}`] = `%${kw}%`; });
        qb.addOrderBy(`CASE WHEN (${conditions}) THEN 0 ELSE 1 END`, 'ASC');
        qb.setParameters(params);
      }
    }
    qb.addOrderBy('RAND()').take(bankCount);
    bankQuestions = await qb.getMany();

    // fallback: if not enough, fill with random
    if (bankQuestions.length < bankCount) {
      const existingIds = bankQuestions.map(q => q.id);
      const fallbackQb = this.qbRepo.createQueryBuilder('q');
      if (existingIds.length > 0) {
        fallbackQb.where('q.id NOT IN (:...existingIds)', { existingIds });
      }
      fallbackQb.orderBy('RAND()').take(bankCount - bankQuestions.length);
      const fallback = await fallbackQb.getMany();
      bankQuestions.push(...fallback);
    }
    strategy.bankCount = bankQuestions.length;

    // ========== 增强层：JD 定制题 + 简历追问题 ==========
    const enhancedQuestions: { question: string; source: string; referenceAnswer?: string }[] = [];

    if (dto.jobDescription && await this.aiRuntimeService.isConfigured()) {
      try {
        const jdResult = await this.aiRuntimeService.chatJson<{ questions?: { question: string; referenceAnswer?: string }[] }>({
          scene: 'interview_generate',
          maxTokens: 800,
          temperature: 0.7,
          systemPrompt: '你是一名专业面试官。根据岗位描述生成 1-2 道针对性面试题。输出 JSON：{"questions":[{"question":"...","referenceAnswer":"..."}]}',
          userPrompt: `岗位描述：${dto.jobDescription.slice(0, 1500)}`,
        });
        if (Array.isArray(jdResult.questions)) {
          for (const q of jdResult.questions.slice(0, 2)) {
            enhancedQuestions.push({ question: q.question, source: 'jd_custom', referenceAnswer: q.referenceAnswer });
          }
        }
      } catch { /* AI unavailable, skip */ }
    }
    strategy.jdCustomCount = enhancedQuestions.length;

    if (resumeContent && await this.aiRuntimeService.isConfigured() && enhancedQuestions.length < 2) {
      try {
        const skills = Array.isArray(resumeContent.skills) ? resumeContent.skills.join(', ') : '';
        const projects = Array.isArray(resumeContent.projects)
          ? resumeContent.projects.map((p: any) => p.name || p.description || '').join('; ')
          : '';
        const resumeResult = await this.aiRuntimeService.chatJson<{ questions?: { question: string; referenceAnswer?: string }[] }>({
          scene: 'interview_generate',
          maxTokens: 800,
          temperature: 0.7,
          systemPrompt: '你是一名专业面试官。根据候选人简历技能和项目经历生成 1 道追问题。输出 JSON：{"questions":[{"question":"...","referenceAnswer":"..."}]}',
          userPrompt: `技能：${skills}\n项目经历：${projects}`,
        });
        if (Array.isArray(resumeResult.questions)) {
          for (const q of resumeResult.questions.slice(0, 1)) {
            enhancedQuestions.push({ question: q.question, source: 'resume_followup', referenceAnswer: q.referenceAnswer });
          }
        }
      } catch { /* AI unavailable, skip */ }
    }
    strategy.resumeFollowupCount = enhancedQuestions.filter(q => q.source === 'resume_followup').length;

    // ========== 组装面试记录 ==========
    const allQuestionItems: { question: string; questionType: string; referenceAnswer?: string; questionSource: string }[] = [];
    for (const q of bankQuestions) {
      allQuestionItems.push({ question: q.question, questionType: q.positionType || 'general', referenceAnswer: q.referenceAnswer, questionSource: 'bank' });
    }
    for (const q of enhancedQuestions) {
      allQuestionItems.push({ question: q.question, questionType: 'custom', referenceAnswer: q.referenceAnswer, questionSource: q.source });
    }

    const interview = this.interviewRepo.create({
      userId,
      jobTitle: dto.jobTitle,
      jobDescription: dto.jobDescription,
      resumeId: dto.resumeId,
      questionCount: allQuestionItems.length,
      questionStrategy: strategy,
    });
    const saved = await this.interviewRepo.save(interview);

    const iqEntities = allQuestionItems.map((q, i) =>
      this.iqRepo.create({
        interviewId: saved.id,
        orderIndex: i + 1,
        question: q.question,
        questionType: q.questionType,
        referenceAnswer: q.referenceAnswer,
        questionSource: q.questionSource,
      }),
    );
    await this.iqRepo.save(iqEntities);

    for (const q of bankQuestions) {
      await this.qbRepo.increment({ id: q.id }, 'frequency', 1);
    }

    return this.getInterviewDetail(saved.id, userId);
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

  async getAllInterviewsAdmin(page = 1, pageSize = 10, keyword?: string, status?: string) {
    const qb = this.interviewRepo.createQueryBuilder('i')
      .leftJoinAndSelect('i.user', 'user');
    if (keyword) {
      qb.andWhere('(i.jobTitle LIKE :kw OR user.username LIKE :kw OR user.nickname LIKE :kw)', { kw: `%${keyword}%` });
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
    return interview;
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
    return interview;
  }

  async submitAnswer(interviewId: number, questionId: number, userId: number, dto: SubmitAnswerDto) {
    const interview = await this.interviewRepo.findOne({ where: { id: interviewId, userId } });
    if (!interview) throw new NotFoundException('面试记录不存在');

    const question = await this.iqRepo.findOne({ where: { id: questionId, interviewId } });
    if (!question) throw new NotFoundException('题目不存在');

    const { score, dimensionScores, feedback } = await this.evaluateAnswer(dto.answer, question.question, question.referenceAnswer);

    question.answer = dto.answer;
    question.score = score;
    question.dimensionScores = dimensionScores;
    question.feedback = feedback;
    question.isAnswered = true;
    await this.iqRepo.save(question);

    interview.answeredCount = await this.iqRepo.count({ where: { interviewId, isAnswered: true } });

    if (interview.answeredCount >= interview.questionCount) {
      interview.status = InterviewStatus.COMPLETED;
      const allQuestions = await this.iqRepo.find({ where: { interviewId } });
      const totalScore = allQuestions.reduce((sum, q) => sum + q.score, 0);
      interview.totalScore = Math.round(totalScore / allQuestions.length);
      interview.dimensionScores = this.aggregateDimensionScores(allQuestions);
      interview.overallFeedback = this.generateOverallFeedback(interview.totalScore, interview.dimensionScores);
    }

    await this.interviewRepo.save(interview);
    return question;
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

  private async evaluateAnswer(answer: string, question: string, referenceAnswer?: string): Promise<{
    score: number;
    dimensionScores: Record<string, number>;
    feedback: string;
  }> {
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
          systemPrompt: [
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
            feedback: aiResult.feedback.trim() || 'AI 已完成评分',
          };
        }
      } catch {
        // AI 不可用时自动回退到规则评分，避免答题流程中断。
      }
    }

    return this.evaluateAnswerRuleBased(answer, referenceAnswer);
  }

  private evaluateAnswerRuleBased(answer: string, referenceAnswer?: string): {
    score: number;
    dimensionScores: Record<string, number>;
    feedback: string;
  } {
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
    if (completeness < 60) suggestions.push('回答内容不够充实，建议补充更多细节和具体案例');
    if (logic < 60) suggestions.push('建议使用 STAR 法则（情境-任务-行动-结果）组织回答');
    if (professionalism < 60) suggestions.push('可以加入更多专业术语和技术细节来体现专业度');
    if (expression < 60) suggestions.push('表达可以更加流畅，建议多练习口语表达');
    if (suggestions.length === 0) suggestions.push('回答较为完整，继续保持！可以尝试加入更多量化数据来增强说服力');

    const feedback = `评分：${score}/100\n\n${suggestions.join('\n\n')}${referenceAnswer ? '\n\n参考答案：' + referenceAnswer : ''}`;

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

  private generateOverallFeedback(score: number, dimensions: Record<string, number>): string {
    let level = '需要加强';
    if (score >= 80) level = '表现优秀';
    else if (score >= 60) level = '表现良好';
    else if (score >= 40) level = '有待提高';

    const strongest = Object.entries(dimensions).sort((a, b) => b[1] - a[1])[0];
    const weakest = Object.entries(dimensions).sort((a, b) => a[1] - b[1])[0];

    return `总体评价：${level}（${score}分）\n\n优势维度：${strongest[0]}（${strongest[1]}分）\n待提高维度：${weakest[0]}（${weakest[1]}分）\n\n建议持续练习，重点提升${weakest[0]}方面的表现。`;
  }
}
