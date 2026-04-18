import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { escapeLike } from '../../common/utils/query.util';
import { Company, CompanyStatus } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';
import { Job, JobStatus } from '../job/entities/job.entity';

@Injectable()
export class CompanyService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  private toPublicCompany(company: Company, openJobCount = 0) {
    return {
      id: company.id,
      name: company.name,
      logo: company.logo,
      industry: company.industry,
      scale: company.scale,
      website: company.website,
      description: company.description,
      address: company.address,
      city: company.city,
      type: company.type,
      status: company.status,
      isVerified: company.isVerified,
      openJobCount,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  private toPublicJobSummary(job: Job) {
    return {
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      positionType: job.positionType,
      workType: job.workType,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      description: job.description,
      requirements: job.requirements,
      createdAt: job.createdAt,
      applicationCount: job.applicationCount,
      viewCount: job.viewCount,
    };
  }

  async create(userId: number, dto: CreateCompanyDto) {
    const existing = await this.companyRepo.findOne({ where: { userId } });
    if (existing) throw new ConflictException('您已创建过企业资料，请直接编辑');
    const company = this.companyRepo.create({ ...dto, userId });
    return this.companyRepo.save(company);
  }

  async findAll(query: QueryCompanyDto) {
    const { page = 1, pageSize = 10, keyword, industry, city } = query;
    const qb = this.companyRepo.createQueryBuilder('c');

    if (keyword) {
      qb.andWhere('(c.name LIKE :kw OR c.description LIKE :kw)', { kw: `%${escapeLike(keyword)}%` });
    }
    if (industry) {
      qb.andWhere('c.industry = :ind', { ind: industry });
    }
    if (city) {
      qb.andWhere('c.city LIKE :city', { city: `%${escapeLike(city)}%` });
    }
    qb.andWhere('c.status = :st', { st: CompanyStatus.APPROVED });

    qb.orderBy('c.createdAt', 'DESC')
      .skip(((+page) - 1) * (+pageSize))
      .take(+pageSize);
    const [list, total] = await qb.getManyAndCount();
    const openJobCountMap = await this.getOpenJobCountMap(list.map((company) => company.userId).filter(Boolean));
    return {
      list: list.map((company) => this.toPublicCompany(company, openJobCountMap.get(company.userId) || 0)),
      total,
      page: +page,
      pageSize: +pageSize,
    };
  }

  async findAllAdmin(page = 1, pageSize = 10, keyword?: string, status?: string) {
    const qb = this.companyRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user');
    if (keyword) {
      qb.andWhere('(c.name LIKE :kw OR c.industry LIKE :kw)', { kw: `%${escapeLike(keyword)}%` });
    }
    if (status) {
      qb.andWhere('c.status = :st', { st: status });
    }
    qb.orderBy('c.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findOnePublic(id: number) {
    const company = await this.companyRepo.findOne({
      where: { id, status: CompanyStatus.APPROVED },
    });
    if (!company) throw new NotFoundException('企业不存在');
    const [jobs, openJobCount] = await this.jobRepo.findAndCount({
      where: { userId: company.userId, status: JobStatus.OPEN },
      order: { createdAt: 'DESC' },
      take: 12,
    });
    return {
      ...this.toPublicCompany(company, openJobCount),
      jobs: jobs.map((job) => this.toPublicJobSummary(job)),
    };
  }

  async findOneAdmin(id: number) {
    const company = await this.companyRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('企业不存在');
    return company;
  }

  async findByUserId(userId: number) {
    return this.companyRepo.findOne({ where: { userId } });
  }

  async update(id: number, userId: number, dto: UpdateCompanyDto, isAdmin = false) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('企业不存在');
    if (!isAdmin && company.userId !== userId) {
      throw new ForbiddenException('无权操作');
    }
    Object.assign(company, dto);
    if (!isAdmin && company.status === CompanyStatus.REJECTED) {
      company.status = CompanyStatus.PENDING;
      company.isVerified = false;
      company.rejectReason = '';
    }
    return this.companyRepo.save(company);
  }

  async updateStatus(id: number, status: CompanyStatus, rejectReason?: string) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('企业不存在');
    const previousStatus = company.status;
    company.status = status;
    if (status === CompanyStatus.APPROVED) {
      company.isVerified = true;
      company.rejectReason = '';
    } else if (status === CompanyStatus.REJECTED) {
      company.isVerified = false;
      company.rejectReason = rejectReason || '';
    } else {
      company.isVerified = false;
    }
    const saved = await this.companyRepo.save(company);

    if (previousStatus === CompanyStatus.APPROVED && status !== CompanyStatus.APPROVED) {
      await this.jobRepo.update(
        { userId: company.userId, status: JobStatus.OPEN },
        { status: JobStatus.PAUSED },
      );
    }

    if (previousStatus !== status) {
      await this.notificationService.create({
        type: NotificationType.SYSTEM,
        userId: company.userId,
        content: this.buildStatusNotification(saved, rejectReason),
        meta: {
          path: '/enterprise-cert',
          companyId: company.id,
        },
      });
    }

    return saved;
  }

  async remove(id: number) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('企业不存在');
    await this.companyRepo.remove(company);
    return { message: '删除成功' };
  }

  async getStats() {
    const total = await this.companyRepo.count();
    const approved = await this.companyRepo.count({ where: { status: CompanyStatus.APPROVED } });
    const pending = await this.companyRepo.count({ where: { status: CompanyStatus.PENDING } });
    const rejected = await this.companyRepo.count({ where: { status: CompanyStatus.REJECTED } });
    return { total, approved, pending, rejected };
  }

  private async getOpenJobCountMap(userIds: number[]) {
    if (!userIds.length) return new Map<number, number>();

    const rows = await this.jobRepo
      .createQueryBuilder('job')
      .select('job.userId', 'userId')
      .addSelect('COUNT(*)', 'count')
      .where('job.userId IN (:...userIds)', { userIds })
      .andWhere('job.status = :status', { status: JobStatus.OPEN })
      .groupBy('job.userId')
      .getRawMany();

    return new Map<number, number>(rows.map((row: any) => [Number(row.userId), Number(row.count)]));
  }

  private buildStatusNotification(company: Company, rejectReason?: string) {
    if (company.status === CompanyStatus.APPROVED) {
      return `你的企业认证「${company.name}」已审核通过，现在可以发布职位并处理候选人投递。`;
    }
    if (company.status === CompanyStatus.REJECTED) {
      const reasonText = rejectReason?.trim() ? ` 拒绝原因：${rejectReason.trim()}` : '';
      return `你的企业认证「${company.name}」未通过审核。${reasonText}`.trim();
    }
    return `你的企业认证「${company.name}」状态已更新为审核中，请留意后续审核结果。`;
  }
}
