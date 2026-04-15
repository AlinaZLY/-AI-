import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { UserRole } from '../user/entities/user.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDto } from './dto/query-job.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    private companyService: CompanyService,
  ) {}

  async create(userId: number, dto: CreateJobDto, userRole?: string) {
    if (userRole !== UserRole.ADMIN) {
      const company = await this.companyService.findByUserId(userId);
      if (!company) {
        throw new ForbiddenException('请先完成企业认证后再发布职位');
      }
      if (!company.isVerified) {
        throw new ForbiddenException('企业认证审核中或未通过，暂时无法发布职位');
      }
    }
    const job = this.jobRepo.create({ ...dto, userId });
    return this.jobRepo.save(job);
  }

  async findAll(query: QueryJobDto) {
    const { page = 1, pageSize = 10, keyword, location, positionType, workType, status, companyId, salaryMin, salaryMax, sort } = query;
    const qb = this.jobRepo.createQueryBuilder('job')
      .leftJoinAndSelect('job.user', 'user');

    if (keyword) {
      qb.andWhere('(job.title LIKE :kw OR job.companyName LIKE :kw OR job.description LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (location) {
      qb.andWhere('job.location LIKE :loc', { loc: `%${location}%` });
    }
    if (positionType) {
      qb.andWhere('job.positionType = :pt', { pt: positionType });
    }
    if (workType) {
      qb.andWhere('job.workType = :wt', { wt: workType });
    }
    if (status) {
      qb.andWhere('job.status = :st', { st: status });
    } else {
      qb.andWhere('job.status = :st', { st: JobStatus.OPEN });
    }
    if (companyId) {
      qb.andWhere('job.companyId = :cid', { cid: companyId });
    }
    if (salaryMin) {
      qb.andWhere('job.salaryMax >= :smin', { smin: salaryMin });
    }
    if (salaryMax) {
      qb.andWhere('job.salaryMin <= :smax', { smax: salaryMax });
    }

    if (sort === 'salary') {
      qb.orderBy('job.salaryMax', 'DESC');
    } else if (sort === 'views') {
      qb.orderBy('job.viewCount', 'DESC');
    } else {
      qb.orderBy('job.createdAt', 'DESC');
    }

    qb.skip(((+page) - 1) * (+pageSize)).take(+pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findAllAdmin(page = 1, pageSize = 10, keyword?: string, status?: string) {
    const qb = this.jobRepo.createQueryBuilder('job')
      .leftJoinAndSelect('job.user', 'user');

    if (keyword) {
      qb.andWhere('(job.title LIKE :kw OR job.companyName LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (status) {
      qb.andWhere('job.status = :st', { st: status });
    }

    qb.orderBy('job.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findOne(id: number) {
    const job = await this.jobRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!job) throw new NotFoundException('职位不存在');
    await this.jobRepo.increment({ id }, 'viewCount', 1);
    job.viewCount += 1;
    return job;
  }

  async update(id: number, userId: number, dto: UpdateJobDto, isAdmin = false) {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('职位不存在');
    if (!isAdmin && job.userId !== userId) {
      throw new ForbiddenException('无权操作此职位');
    }
    Object.assign(job, dto);
    return this.jobRepo.save(job);
  }

  async remove(id: number, userId: number, isAdmin = false) {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('职位不存在');
    if (!isAdmin && job.userId !== userId) {
      throw new ForbiddenException('无权操作此职位');
    }
    await this.jobRepo.remove(job);
    return { message: '删除成功' };
  }

  async findByUser(userId: number, page = 1, pageSize = 10) {
    const [list, total] = await this.jobRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async getStats() {
    const total = await this.jobRepo.count();
    const open = await this.jobRepo.count({ where: { status: JobStatus.OPEN } });
    const closed = await this.jobRepo.count({ where: { status: JobStatus.CLOSED } });
    return { total, open, closed };
  }
}
