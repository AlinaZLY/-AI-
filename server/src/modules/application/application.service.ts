import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Application, ApplicationStatus, ApplicationTag } from './entities/application.entity';
import { ApplicationStatusLog } from './entities/application-status-log.entity';
import { ApplicationNote } from './entities/application-note.entity';
import { Resume } from '../resume/entities/resume.entity';
import { Job } from '../job/entities/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { ApplicationActionDto } from './dto/application-action.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

const CHECK_IN_NOTE_PREFIX = '[面试签到]';
const RESULT_INQUIRY_NOTE_PREFIX = '[结果询问]';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
    @InjectRepository(ApplicationStatusLog)
    private logRepo: Repository<ApplicationStatusLog>,
    @InjectRepository(ApplicationNote)
    private noteRepo: Repository<ApplicationNote>,
    @InjectRepository(Resume)
    private resumeRepo: Repository<Resume>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  async findAllAdmin(page = 1, pageSize = 10, keyword?: string, status?: string, tag?: string) {
    const qb = this.appRepo
      .createQueryBuilder('app')
      .leftJoin('app.user', 'user')
      .addSelect(['user.id', 'user.username', 'user.nickname', 'user.avatar']);

    if (keyword) {
      qb.andWhere('(app.company LIKE :kw OR app.position LIKE :kw OR user.username LIKE :kw OR user.nickname LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (status) qb.andWhere('app.status = :status', { status });
    if (tag) qb.andWhere('app.tag = :tag', { tag });

    qb.orderBy('app.updatedAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async create(userId: number, dto: CreateApplicationDto) {
    if (dto.jobId && (!dto.company || !dto.position)) {
      const job = await this.jobRepo.findOne({ where: { id: dto.jobId } });
      if (job) {
        if (!dto.company) dto.company = job.companyName || '未知公司';
        if (!dto.position) dto.position = job.title;
        if (!dto.location) dto.location = job.location;
        if (!dto.salaryRange && job.salaryMin && job.salaryMax) {
          dto.salaryRange = `${job.salaryMin}-${job.salaryMax}K`;
        }
      }
    }
    if (!dto.company) throw new ForbiddenException('公司名称不能为空');
    if (!dto.position) throw new ForbiddenException('职位名称不能为空');

    if (dto.resumeId) {
      const resume = await this.resumeRepo.findOne({ where: { id: dto.resumeId } });
      if (!resume || resume.userId !== userId) {
        throw new ForbiddenException('无权使用此简历');
      }
    }

    // 平台职位投递按“用户 + 职位”唯一，避免重复投递污染流程数据。
    if (dto.jobId) {
      const existing = await this.appRepo.findOne({
        where: { userId, jobId: dto.jobId },
        select: ['id'],
      });
      if (existing) {
        throw new ConflictException('你已投递过该职位，请勿重复投递');
      }
    }

    const app = this.appRepo.create({ ...dto, userId });
    const saved = await this.appRepo.save(app);

    if (saved.jobId) {
      await this.jobRepo.increment({ id: saved.jobId }, 'applicationCount', 1);
    }

    await this.logRepo.save(
      this.logRepo.create({
        applicationId: saved.id,
        fromStatus: ApplicationStatus.PENDING,
        toStatus: ApplicationStatus.PENDING,
        note: '创建投递记录',
      }),
    );

    return saved;
  }

  async findAll(userId: number, query: QueryApplicationDto) {
    const { page = 1, pageSize = 10, keyword, status, tag, company, sort } = query;

    const qb = this.appRepo
      .createQueryBuilder('app')
      .where('app.userId = :userId', { userId });

    if (keyword) {
      qb.andWhere('(app.company LIKE :kw OR app.position LIKE :kw)', {
        kw: `%${keyword}%`,
      });
    }
    if (status) {
      qb.andWhere('app.status = :status', { status });
    }
    if (tag) {
      qb.andWhere('app.tag = :tag', { tag });
    }
    if (company) {
      qb.andWhere('app.company LIKE :company', { company: `%${company}%` });
    }

    if (sort === 'nextDate') {
      qb.orderBy('CASE WHEN app.nextDate IS NULL THEN 1 ELSE 0 END', 'ASC')
        .addOrderBy('app.nextDate', 'ASC');
    } else if (sort === 'company') {
      qb.orderBy('app.company', 'ASC');
    } else {
      qb.orderBy('app.updatedAt', 'DESC');
    }

    qb.skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    const enrichedList = await this.attachStageMeta(list);

    return { list: enrichedList, total, page: +page, pageSize: +pageSize };
  }

  async findOne(id: number, userId: number) {
    const app = await this.appRepo.findOne({
      where: { id, userId },
      relations: ['statusLogs', 'notes'],
    });
    if (!app) throw new NotFoundException('投递记录不存在');

    if (app.statusLogs) {
      app.statusLogs.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    if (app.notes) {
      app.notes.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return this.attachStageMetaToItem(app);
  }

  async update(id: number, userId: number, dto: UpdateApplicationDto) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    if (app.jobId) {
      throw new ForbiddenException('平台职位投递记录不能手动编辑，请使用备注功能');
    }
    Object.assign(app, dto);
    return this.appRepo.save(app);
  }

  async remove(id: number, userId: number) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    if (app.jobId) {
      throw new ForbiddenException('平台职位投递记录不能删除');
    }
    await this.appRepo.remove(app);
  }

  async updateStatus(id: number, userId: number, dto: UpdateStatusDto) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    if (app.jobId) {
      throw new ForbiddenException('平台职位投递状态由企业维护，请使用签到或结果询问功能');
    }

    const fromStatus = app.status;
    app.status = dto.status;
    if (dto.nextDate !== undefined) {
      app.nextDate = dto.nextDate ? new Date(dto.nextDate) : null as any;
    }

    if (dto.status === ApplicationStatus.OFFER) {
      app.tag = ApplicationTag.PASSED;
    } else if (dto.status === ApplicationStatus.REJECTED) {
      app.tag = ApplicationTag.FAILED;
    }

    await this.appRepo.save(app);

    await this.logRepo.save(
      this.logRepo.create({
        applicationId: id,
        fromStatus,
        toStatus: dto.status,
        note: dto.note,
      }),
    );

    return app;
  }

  async findAllForCompany(userId: number, page = 1, pageSize = 10, keyword?: string, status?: string, tag?: string) {
    const qb = this.appRepo
      .createQueryBuilder('app')
      .innerJoin(Job, 'job', 'job.id = app.jobId')
      .leftJoin('app.user', 'user')
      .addSelect(['user.id', 'user.username', 'user.nickname', 'user.avatar'])
      .where('job.userId = :userId', { userId });

    if (keyword) {
      qb.andWhere('(app.company LIKE :kw OR app.position LIKE :kw OR user.username LIKE :kw OR user.nickname LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (status) qb.andWhere('app.status = :status', { status });
    if (tag) qb.andWhere('app.tag = :tag', { tag });

    qb.orderBy('app.updatedAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    const stageEnrichedList = await this.attachStageMeta(list);
    const resumeEnrichedList = await this.attachResumeSummary(stageEnrichedList);
    return { list: resumeEnrichedList, total, page: +page, pageSize: +pageSize };
  }

  async getStatsForCompany(userId: number) {
    const baseQb = this.appRepo
      .createQueryBuilder('app')
      .innerJoin(Job, 'job', 'job.id = app.jobId')
      .where('job.userId = :userId', { userId });

    const total = await baseQb.getCount();

    const byStatus = await this.appRepo
      .createQueryBuilder('app')
      .innerJoin(Job, 'job', 'job.id = app.jobId')
      .select('app.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('job.userId = :userId', { userId })
      .groupBy('app.status')
      .getRawMany();

    const byTag = await this.appRepo
      .createQueryBuilder('app')
      .innerJoin(Job, 'job', 'job.id = app.jobId')
      .select('app.tag', 'tag')
      .addSelect('COUNT(*)', 'count')
      .where('job.userId = :userId', { userId })
      .groupBy('app.tag')
      .getRawMany();

    return { total, byStatus, byTag };
  }

  async updateStatusForCompany(id: number, userId: number, dto: UpdateStatusDto) {
    const app = await this.appRepo
      .createQueryBuilder('app')
      .innerJoin(Job, 'job', 'job.id = app.jobId')
      .where('app.id = :id', { id })
      .andWhere('job.userId = :userId', { userId })
      .getOne();

    if (!app) throw new NotFoundException('投递记录不存在');

    const fromStatus = app.status;

    // 校验状态流转合法性：禁止从终结状态回退，禁止非法跳转
    if (fromStatus !== dto.status) {
      const allowed = this.getAllowedCompanyTransitions(fromStatus);
      if (!allowed.includes(dto.status)) {
        throw new ForbiddenException(
          `不允许从「${this.getStatusText(fromStatus)}」流转到「${this.getStatusText(dto.status)}」`,
        );
      }
    }

    app.status = dto.status;
    if (dto.nextDate !== undefined) {
      app.nextDate = dto.nextDate ? new Date(dto.nextDate) : null as any;
    }

    if (dto.status === ApplicationStatus.OFFER) {
      app.tag = ApplicationTag.PASSED;
    } else if (dto.status === ApplicationStatus.REJECTED) {
      app.tag = ApplicationTag.FAILED;
    } else {
      app.tag = ApplicationTag.IN_PROGRESS;
    }

    await this.appRepo.save(app);

    await this.logRepo.save(
      this.logRepo.create({
        applicationId: id,
        fromStatus,
        toStatus: dto.status,
        note: dto.note || '企业更新了投递进度',
      }),
    );

    await this.sendCompanyStatusNotification(app, dto.status, dto.nextDate, dto.note);

    return app;
  }

  async sendResultForCompany(id: number, userId: number, dto: UpdateStatusDto) {
    const app = await this.appRepo
      .createQueryBuilder('app')
      .innerJoin(Job, 'job', 'job.id = app.jobId')
      .where('app.id = :id', { id })
      .andWhere('job.userId = :userId', { userId })
      .getOne();

    if (!app) throw new NotFoundException('投递记录不存在');
    if (!this.isInterviewStage(app.status)) {
      throw new ForbiddenException('当前流程无需发送面试结果');
    }
    if (dto.status === app.status) {
      throw new ForbiddenException('面试结果需要更新到下一步流程或结束状态');
    }

    const allowedStatuses = this.getAllowedResultStatuses(app.status);
    if (!allowedStatuses.includes(dto.status)) {
      throw new ForbiddenException('当前轮次不支持该结果流转');
    }

    const note = dto.note?.trim() || `企业已反馈${this.getStatusText(app.status)}结果`;
    return this.updateStatusForCompany(id, userId, {
      ...dto,
      note,
    });
  }

  async checkIn(id: number, userId: number, dto: ApplicationActionDto) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    if (!this.isInterviewStage(app.status)) {
      throw new ForbiddenException('当前流程无需面试签到');
    }
    if (!this.hasDateStarted(app.nextDate)) {
      throw new ForbiddenException('未到签到时间');
    }

    const logs = await this.logRepo.find({
      where: { applicationId: id },
      order: { createdAt: 'DESC' },
    });
    const stageMeta = this.buildStageMeta(app, logs);
    if (stageMeta.checkedInAt) {
      throw new ForbiddenException('本轮面试已完成签到');
    }

    const note = this.buildActionNote(
      CHECK_IN_NOTE_PREFIX,
      `候选人已完成${this.getStatusText(app.status)}签到`,
      dto.note,
    );

    await this.logRepo.save(
      this.logRepo.create({
        applicationId: id,
        fromStatus: app.status,
        toStatus: app.status,
        note,
      }),
    );

    await this.notifyCompanyOwner(
      app,
      `候选人已完成「${app.company} - ${app.position}」的${this.getStatusText(app.status)}签到`,
    );

    return { success: true };
  }

  async inquireResult(id: number, userId: number, dto: ApplicationActionDto) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    if (!this.isInterviewStage(app.status)) {
      throw new ForbiddenException('当前流程无需询问面试结果');
    }

    const logs = await this.logRepo.find({
      where: { applicationId: id },
      order: { createdAt: 'DESC' },
    });
    const stageMeta = this.buildStageMeta(app, logs);
    if (!stageMeta.checkedInAt) {
      throw new ForbiddenException('完成面试签到后才能询问结果');
    }
    if (stageMeta.resultInquiryAt) {
      throw new ForbiddenException('本轮面试结果已询问，请等待企业反馈');
    }
    if (!this.isNextDayOrLater(app.nextDate)) {
      throw new ForbiddenException('请在面试次日后再询问结果');
    }

    const note = this.buildActionNote(
      RESULT_INQUIRY_NOTE_PREFIX,
      `候选人已询问${this.getStatusText(app.status)}结果`,
      dto.note,
    );

    await this.logRepo.save(
      this.logRepo.create({
        applicationId: id,
        fromStatus: app.status,
        toStatus: app.status,
        note,
      }),
    );

    await this.notifyCompanyOwner(
      app,
      `候选人正在询问「${app.company} - ${app.position}」的${this.getStatusText(app.status)}结果，请及时反馈`,
    );

    return { success: true };
  }

  private async sendCompanyStatusNotification(app: Application, status: ApplicationStatus, nextDate?: string, note?: string) {
    const scheduleText = nextDate ? `，时间：${nextDate}` : '';
    const noteText = note ? `，说明：${note}` : '';
    await this.notificationService.create({
      type: NotificationType.SYSTEM,
      userId: app.userId,
      content: `你的投递「${app.company} - ${app.position}」状态已更新为${this.getStatusText(status)}${scheduleText}${noteText}`,
      meta: {
        path: '/applications',
        applicationId: app.id,
        jobId: app.jobId || null,
      },
    });
  }

  async getStatusLogs(id: number, userId: number) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');

    return this.logRepo.find({
      where: { applicationId: id },
      order: { createdAt: 'DESC' },
    });
  }

  async addNote(id: number, userId: number, dto: CreateNoteDto) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');

    const note = this.noteRepo.create({ ...dto, applicationId: id });
    return this.noteRepo.save(note);
  }

  async getNotes(id: number, userId: number) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');

    return this.noteRepo.find({
      where: { applicationId: id },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteNote(noteId: number, userId: number) {
    const note = await this.noteRepo.findOne({
      where: { id: noteId },
      relations: ['application'],
    });
    if (!note) throw new NotFoundException('备注不存在');
    if (note.application.userId !== userId) {
      throw new ForbiddenException('无权操作');
    }
    await this.noteRepo.remove(note);
  }

  async getCalendar(userId: number, startDate?: string, endDate?: string) {
    const qb = this.appRepo
      .createQueryBuilder('app')
      .where('app.userId = :userId', { userId })
      .andWhere('app.nextDate IS NOT NULL')
      .andWhere('app.tag = :tag', { tag: ApplicationTag.IN_PROGRESS });

    if (startDate && endDate) {
      qb.andWhere('app.nextDate BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    qb.orderBy('app.nextDate', 'ASC');
    return qb.getMany();
  }

  async getStats(userId: number) {
    const total = await this.appRepo.count({ where: { userId } });

    const byStatus = await this.appRepo
      .createQueryBuilder('app')
      .select('app.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('app.userId = :userId', { userId })
      .groupBy('app.status')
      .getRawMany();

    const byTag = await this.appRepo
      .createQueryBuilder('app')
      .select('app.tag', 'tag')
      .addSelect('COUNT(*)', 'count')
      .where('app.userId = :userId', { userId })
      .groupBy('app.tag')
      .getRawMany();

    const byCompany = await this.appRepo
      .createQueryBuilder('app')
      .select('app.company', 'company')
      .addSelect('COUNT(*)', 'count')
      .where('app.userId = :userId', { userId })
      .groupBy('app.company')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return { total, byStatus, byTag, byCompany };
  }

  private async attachStageMeta<T extends Application>(applications: T[]) {
    if (!applications.length) return applications;

    const logs = await this.logRepo.find({
      where: { applicationId: In(applications.map((app) => app.id)) },
      order: { createdAt: 'DESC' },
    });

    const logsByApplication = logs.reduce<Record<number, ApplicationStatusLog[]>>((acc, log) => {
      if (!acc[log.applicationId]) acc[log.applicationId] = [];
      acc[log.applicationId].push(log);
      return acc;
    }, {});

    return applications.map((app) => Object.assign(app, {
      stageMeta: this.buildStageMeta(app, logsByApplication[app.id] || []),
    }));
  }

  private async attachResumeSummary<T extends Application>(applications: T[]) {
    const resumeIds = Array.from(new Set(applications.map((app) => app.resumeId).filter(Boolean)));
    if (!resumeIds.length) return applications;

    const resumes = await this.resumeRepo.find({
      where: { id: In(resumeIds as number[]) },
      select: ['id', 'title', 'targetPosition', 'filePath', 'content', 'updatedAt'],
    });
    const resumeMap = new Map(resumes.map((resume) => [resume.id, resume]));

    return applications.map((app) => Object.assign(app, {
      resume: app.resumeId ? resumeMap.get(app.resumeId) || null : null,
    }));
  }

  private async attachStageMetaToItem<T extends Application>(application: T) {
    const logs = await this.logRepo.find({
      where: { applicationId: application.id },
      order: { createdAt: 'DESC' },
    });

    return Object.assign(application, {
      stageMeta: this.buildStageMeta(application, logs),
    });
  }

  private buildStageMeta(app: Application, logs: ApplicationStatusLog[]) {
    const stageStartAt = this.getStageStartAt(app, logs);
    const relevantLogs = logs.filter((log) => new Date(log.createdAt).getTime() >= stageStartAt.getTime());
    const checkedInLog = relevantLogs.find((log) => (log.note || '').startsWith(CHECK_IN_NOTE_PREFIX));
    const inquiryLog = relevantLogs.find((log) => (log.note || '').startsWith(RESULT_INQUIRY_NOTE_PREFIX));

    return {
      stageStartAt,
      checkedInAt: checkedInLog?.createdAt || null,
      resultInquiryAt: inquiryLog?.createdAt || null,
    };
  }

  private getStageStartAt(app: Application, logs: ApplicationStatusLog[]) {
    const stageTransitionLog = logs.find((log) => log.toStatus === app.status && log.fromStatus !== log.toStatus);
    return stageTransitionLog ? new Date(stageTransitionLog.createdAt) : new Date(app.updatedAt || app.createdAt);
  }

  private isInterviewStage(status: ApplicationStatus) {
    return [
      ApplicationStatus.WRITTEN_TEST,
      ApplicationStatus.FIRST_INTERVIEW,
      ApplicationStatus.SECOND_INTERVIEW,
      ApplicationStatus.HR_INTERVIEW,
    ].includes(status);
  }

  private getAllowedResultStatuses(status: ApplicationStatus) {
    const map: Record<ApplicationStatus, ApplicationStatus[]> = {
      [ApplicationStatus.PENDING]: [],
      [ApplicationStatus.WRITTEN_TEST]: [
        ApplicationStatus.FIRST_INTERVIEW,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.FIRST_INTERVIEW]: [
        ApplicationStatus.SECOND_INTERVIEW,
        ApplicationStatus.HR_INTERVIEW,
        ApplicationStatus.OFFER,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.SECOND_INTERVIEW]: [
        ApplicationStatus.HR_INTERVIEW,
        ApplicationStatus.OFFER,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.HR_INTERVIEW]: [
        ApplicationStatus.OFFER,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.OFFER]: [],
      [ApplicationStatus.REJECTED]: [],
    };

    return map[status] || [];
  }

  private getAllowedCompanyTransitions(status: ApplicationStatus): ApplicationStatus[] {
    const map: Record<ApplicationStatus, ApplicationStatus[]> = {
      [ApplicationStatus.PENDING]: [
        ApplicationStatus.WRITTEN_TEST,
        ApplicationStatus.FIRST_INTERVIEW,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.WRITTEN_TEST]: [
        ApplicationStatus.FIRST_INTERVIEW,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.FIRST_INTERVIEW]: [
        ApplicationStatus.SECOND_INTERVIEW,
        ApplicationStatus.HR_INTERVIEW,
        ApplicationStatus.OFFER,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.SECOND_INTERVIEW]: [
        ApplicationStatus.HR_INTERVIEW,
        ApplicationStatus.OFFER,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.HR_INTERVIEW]: [
        ApplicationStatus.OFFER,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.OFFER]: [],
      [ApplicationStatus.REJECTED]: [],
    };
    return map[status] || [];
  }

  private getStatusText(status: ApplicationStatus) {
    const statusText: Record<ApplicationStatus, string> = {
      [ApplicationStatus.PENDING]: '待筛选',
      [ApplicationStatus.WRITTEN_TEST]: '笔试邀请',
      [ApplicationStatus.FIRST_INTERVIEW]: '一面邀请',
      [ApplicationStatus.SECOND_INTERVIEW]: '二面邀请',
      [ApplicationStatus.HR_INTERVIEW]: 'HR 面邀请',
      [ApplicationStatus.OFFER]: 'Offer 通知',
      [ApplicationStatus.REJECTED]: '未通过',
    };

    return statusText[status] || status;
  }

  private buildActionNote(prefix: string, baseText: string, extraNote?: string) {
    const cleanNote = extraNote?.trim();
    return cleanNote ? `${prefix} ${baseText}，备注：${cleanNote}` : `${prefix} ${baseText}`;
  }

  private hasDateStarted(nextDate?: Date) {
    if (!nextDate) return false;
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const t = new Date(nextDate);
    const targetUTC = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
    return todayUTC >= targetUTC;
  }

  private isNextDayOrLater(nextDate?: Date) {
    if (!nextDate) return false;
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const t = new Date(nextDate);
    const targetUTC = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
    return todayUTC > targetUTC;
  }

  private async notifyCompanyOwner(app: Application, content: string) {
    if (!app.jobId) return;
    const job = await this.jobRepo.findOne({ where: { id: app.jobId } });
    if (!job?.userId) return;

    await this.notificationService.create({
      type: NotificationType.SYSTEM,
      userId: job.userId,
      fromUserId: app.userId,
      content,
      meta: {
        path: '/applications',
        applicationId: app.id,
        jobId: app.jobId || null,
      },
    });
  }
}
