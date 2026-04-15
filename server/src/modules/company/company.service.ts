import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, CompanyStatus } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {}

  async create(userId: number, dto: CreateCompanyDto) {
    const existing = await this.companyRepo.findOne({ where: { userId } });
    if (existing) throw new ConflictException('您已创建过企业资料，请直接编辑');
    const company = this.companyRepo.create({ ...dto, userId });
    return this.companyRepo.save(company);
  }

  async findAll(query: QueryCompanyDto) {
    const { page = 1, pageSize = 10, keyword, industry, city, status } = query;
    const qb = this.companyRepo.createQueryBuilder('c');

    if (keyword) {
      qb.andWhere('(c.name LIKE :kw OR c.description LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (industry) {
      qb.andWhere('c.industry = :ind', { ind: industry });
    }
    if (city) {
      qb.andWhere('c.city LIKE :city', { city: `%${city}%` });
    }
    if (status) {
      qb.andWhere('c.status = :st', { st: status });
    } else {
      qb.andWhere('c.status = :st', { st: CompanyStatus.APPROVED });
    }

    qb.orderBy('c.createdAt', 'DESC')
      .skip(((+page) - 1) * (+pageSize))
      .take(+pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findAllAdmin(page = 1, pageSize = 10, keyword?: string, status?: string) {
    const qb = this.companyRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user');
    if (keyword) {
      qb.andWhere('(c.name LIKE :kw OR c.industry LIKE :kw)', { kw: `%${keyword}%` });
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

  async findOne(id: number) {
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
    return this.companyRepo.save(company);
  }

  async updateStatus(id: number, status: CompanyStatus, rejectReason?: string) {
    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('企业不存在');
    company.status = status;
    if (status === CompanyStatus.APPROVED) {
      company.isVerified = true;
      company.rejectReason = '';
    } else if (status === CompanyStatus.REJECTED) {
      company.isVerified = false;
      company.rejectReason = rejectReason || '';
    }
    return this.companyRepo.save(company);
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
    return { total, approved, pending };
  }
}
