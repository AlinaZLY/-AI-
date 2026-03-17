import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus, ApplicationTag } from './entities/application.entity';
import { ApplicationStatusLog } from './entities/application-status-log.entity';
import { ApplicationNote } from './entities/application-note.entity';
import { Resume } from '../resume/entities/resume.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
    @InjectRepository(ApplicationStatusLog)
    private logRepo: Repository<ApplicationStatusLog>,
    @InjectRepository(ApplicationNote)
    private noteRepo: Repository<ApplicationNote>,
    @InjectRepository(Resume)
    private resumeRepo: Repository<Resume>,
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
    if (dto.resumeId) {
      const resume = await this.resumeRepo.findOne({ where: { id: dto.resumeId } });
      if (!resume || resume.userId !== userId) {
        throw new ForbiddenException('无权使用此简历');
      }
    }
    const app = this.appRepo.create({ ...dto, userId });
    const saved = await this.appRepo.save(app);

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

    return { list, total, page: +page, pageSize: +pageSize };
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

    return app;
  }

  async update(id: number, userId: number, dto: UpdateApplicationDto) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    Object.assign(app, dto);
    return this.appRepo.save(app);
  }

  async remove(id: number, userId: number) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');
    await this.appRepo.remove(app);
  }

  async updateStatus(id: number, userId: number, dto: UpdateStatusDto) {
    const app = await this.appRepo.findOne({ where: { id, userId } });
    if (!app) throw new NotFoundException('投递记录不存在');

    const fromStatus = app.status;
    app.status = dto.status;

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
}
