import { Injectable, NotFoundException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview, InterviewStatus } from './entities/interview.entity';
import { InterviewQuestion } from './entities/interview-question.entity';
import { QuestionBank, QuestionDifficulty, QuestionSource } from './entities/question-bank.entity';
import { QuestionCategory } from './entities/question-category.entity';
import { Resume } from '../resume/entities/resume.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { seedQuestions } from './seed-questions';

@Injectable()
export class InterviewService implements OnModuleInit {
  constructor(
    @InjectRepository(Interview) private interviewRepo: Repository<Interview>,
    @InjectRepository(InterviewQuestion) private iqRepo: Repository<InterviewQuestion>,
    @InjectRepository(QuestionBank) private qbRepo: Repository<QuestionBank>,
    @InjectRepository(QuestionCategory) private qcRepo: Repository<QuestionCategory>,
    @InjectRepository(Resume) private resumeRepo: Repository<Resume>,
  ) {}

  async onModuleInit() {
    const catCount = await this.qcRepo.count();
    if (catCount === 0) {
      const tech = await this.qcRepo.save(this.qcRepo.create({ name: '技术面试', type: 'type', description: '技术类面试题', sort: 1 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: '数据结构与算法', parentId: tech.id, type: 'type', sort: 1 },
        { name: '计算机网络', parentId: tech.id, type: 'type', sort: 2 },
        { name: '操作系统', parentId: tech.id, type: 'type', sort: 3 },
        { name: '数据库', parentId: tech.id, type: 'type', sort: 4 },
        { name: '系统设计', parentId: tech.id, type: 'type', sort: 5 },
      ]));

      const behavior = await this.qcRepo.save(this.qcRepo.create({ name: '行为面试', type: 'type', description: '行为和情景类', sort: 2 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: '自我介绍', parentId: behavior.id, type: 'type', sort: 1 },
        { name: 'STAR法则', parentId: behavior.id, type: 'type', sort: 2 },
        { name: '职业规划', parentId: behavior.id, type: 'type', sort: 3 },
        { name: '情景模拟', parentId: behavior.id, type: 'type', sort: 4 },
      ]));

      const company = await this.qcRepo.save(this.qcRepo.create({ name: '公司专题', type: 'company', description: '按公司分类的面试题', sort: 3 }));
      await this.qcRepo.save(this.qcRepo.create([
        { name: '宝洁八大问', parentId: company.id, type: 'company', sort: 1 },
        { name: '字节跳动', parentId: company.id, type: 'company', sort: 2 },
        { name: '腾讯', parentId: company.id, type: 'company', sort: 3 },
        { name: '阿里巴巴', parentId: company.id, type: 'company', sort: 4 },
      ]));

      await this.qcRepo.save(this.qcRepo.create({ name: '项目经验', type: 'type', description: '项目深挖类', sort: 4 }));
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

      console.log(`面试题库已更新：新增 ${newQuestions.length} 道题，总计 ${qCount + newQuestions.length} 道`);
    }
  }

  // ==================== 题库管理 ====================

  async getCategories() {
    const all = await this.qcRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
    const map = new Map<number, any>();
    const tree: any[] = [];

    for (const cat of all) {
      const count = await this.qbRepo.count({ where: { categoryId: cat.id } });
      map.set(cat.id, { ...cat, questionCount: count, children: [] });
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

  async getQuestions(page = 1, pageSize = 10, categoryId?: number, difficulty?: string, keyword?: string, source?: string, questionType?: string) {
    const qb = this.qbRepo.createQueryBuilder('q');
    if (categoryId) qb.andWhere('q.categoryId = :categoryId', { categoryId });
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

  // ==================== 模拟面试 ====================

  async startInterview(userId: number, dto: StartInterviewDto) {
    if (dto.resumeId) {
      const resume = await this.resumeRepo.findOne({ where: { id: dto.resumeId } });
      if (!resume || resume.userId !== userId) {
        throw new ForbiddenException('无权使用此简历');
      }
    }
    const count = dto.questionCount || 5;

    let questions: QuestionBank[] = [];
    if (dto.categoryId != null) {
      const catIds = await this.collectDescendantCategoryIds(dto.categoryId);
      if (catIds.length > 0) {
        questions = await this.qbRepo
          .createQueryBuilder('q')
          .where('q.categoryId IN (:...catIds)', { catIds })
          .orderBy('RAND()')
          .take(count)
          .getMany();
      }
      if (questions.length === 0) {
        questions = await this.qbRepo.createQueryBuilder('q').orderBy('RAND()').take(count).getMany();
      }
    } else {
      questions = await this.qbRepo.createQueryBuilder('q').orderBy('RAND()').take(count).getMany();
    }

    const interview = this.interviewRepo.create({
      userId,
      jobTitle: dto.jobTitle,
      jobDescription: dto.jobDescription,
      resumeId: dto.resumeId,
      questionCount: questions.length,
    });
    const saved = await this.interviewRepo.save(interview);

    const iqEntities = questions.map((q, i) =>
      this.iqRepo.create({
        interviewId: saved.id,
        orderIndex: i + 1,
        question: q.question,
        questionType: q.positionType || 'general',
        referenceAnswer: q.referenceAnswer,
      }),
    );
    await this.iqRepo.save(iqEntities);

    for (const q of questions) {
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

    const { score, dimensionScores, feedback } = this.evaluateAnswer(dto.answer, question.question, question.referenceAnswer);

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

  private evaluateAnswer(answer: string, question: string, referenceAnswer?: string): {
    score: number;
    dimensionScores: Record<string, number>;
    feedback: string;
  } {
    const answerLen = answer.length;

    const completeness = Math.min(100, Math.round(answerLen / 3));
    const logic = answerLen > 100 ? Math.min(90, 50 + Math.round(answerLen / 10)) : Math.round(answerLen / 2);
    const professionalism = referenceAnswer ? this.calculateSimilarity(answer, referenceAnswer) : Math.min(70, answerLen / 4);
    const expression = answerLen > 50 ? Math.min(85, 40 + Math.round(answerLen / 8)) : Math.round(answerLen * 0.8);
    const innovation = Math.min(75, 30 + Math.round(Math.random() * 30));

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
