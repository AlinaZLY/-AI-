import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { basename, join } from 'path';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../modules/user/entities/user.entity';
import { Company } from '../../modules/company/entities/company.entity';
import { Resume } from '../../modules/resume/entities/resume.entity';
import { Application } from '../../modules/application/entities/application.entity';
import { Job } from '../../modules/job/entities/job.entity';
import { Interview } from '../../modules/interview/entities/interview.entity';
import { InterviewQuestion } from '../../modules/interview/entities/interview-question.entity';

type PrivateUploadCategory = 'certs' | 'resumes' | 'speech';

@Controller('private-uploads')
export class PrivateUploadController {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Company) private readonly companyRepo: Repository<Company>,
    @InjectRepository(Resume) private readonly resumeRepo: Repository<Resume>,
    @InjectRepository(Application) private readonly applicationRepo: Repository<Application>,
    @InjectRepository(InterviewQuestion) private readonly interviewQuestionRepo: Repository<InterviewQuestion>,
  ) {}

  @Get(':category/:filename')
  async servePrivateUpload(
    @Param('category') category: PrivateUploadCategory,
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!['certs', 'resumes', 'speech'].includes(category) || filename !== basename(filename)) {
      throw new NotFoundException('文件不存在');
    }

    const user = await this.authenticate(req);
    const allowed = await this.canAccess(category, filename, user);
    if (!allowed) {
      throw new ForbiddenException('无权访问该文件');
    }

    const filePath = join(process.cwd(), 'uploads', category, filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('文件不存在');
    }

    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.sendFile(filePath);
  }

  private async authenticate(req: Request) {
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const queryToken = typeof req.query.token === 'string' ? req.query.token : '';
    const token = bearerToken || queryToken;
    if (!token) {
      throw new UnauthorizedException('请先登录');
    }

    let payload: { sub?: number; id?: number };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('登录状态已失效，请重新登录');
    }

    const userId = payload.sub || payload.id;
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'username', 'role', 'isActive'],
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('登录状态已失效，请重新登录');
    }
    return user;
  }

  private async canAccess(category: PrivateUploadCategory, filename: string, user: User) {
    if (user.role === UserRole.ADMIN) return true;
    if (category === 'certs') return this.canAccessCert(filename, user.id);
    if (category === 'resumes') return this.canAccessResume(filename, user.id);
    return this.canAccessSpeech(filename, user.id);
  }

  private async canAccessCert(filename: string, userId: number) {
    if (filename.startsWith(`cert-u${userId}-`)) return true;
    const legacyPath = `/uploads/certs/${filename}`;
    const privatePath = `/api/private-uploads/certs/${filename}`;
    const company = await this.companyRepo
      .createQueryBuilder('company')
      .where('company.userId = :userId', { userId })
      .andWhere(
        '(company.businessLicense IN (:...paths) OR company.idCardFront IN (:...paths) OR company.idCardBack IN (:...paths))',
        { paths: [legacyPath, privatePath] },
      )
      .getOne();
    return !!company;
  }

  private async canAccessResume(filename: string, userId: number) {
    if (filename.startsWith(`resume-u${userId}-`)) return true;
    const legacyPath = `/uploads/resumes/${filename}`;
    const privatePath = `/api/private-uploads/resumes/${filename}`;
    const paths = [legacyPath, privatePath];

    const ownResume = await this.resumeRepo.findOne({
      where: paths.map((filePath) => ({ userId, filePath })),
      select: ['id'],
    });
    if (ownResume) return true;

    const accessibleApplication = await this.applicationRepo
      .createQueryBuilder('app')
      .innerJoin(Job, 'job', 'job.id = app.jobId')
      .innerJoin(Resume, 'resume', 'resume.id = app.resumeId')
      .where('job.userId = :userId', { userId })
      .andWhere('resume.filePath IN (:...paths)', { paths })
      .getOne();
    return !!accessibleApplication;
  }

  private async canAccessSpeech(filename: string, userId: number) {
    if (filename.startsWith(`speech_u${userId}_`)) return true;
    const legacyPath = `/uploads/speech/${filename}`;
    const privatePath = `/api/private-uploads/speech/${filename}`;
    const question = await this.interviewQuestionRepo
      .createQueryBuilder('question')
      .innerJoin(Interview, 'interview', 'interview.id = question.interviewId')
      .where('interview.userId = :userId', { userId })
      .andWhere('question.voiceUrl IN (:...paths)', { paths: [legacyPath, privatePath] })
      .getOne();
    return !!question;
  }
}