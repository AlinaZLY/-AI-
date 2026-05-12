import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application, ApplicationStatus, ApplicationTag } from './entities/application.entity';
import { ApplicationStatusLog } from './entities/application-status-log.entity';
import { ApplicationNote } from './entities/application-note.entity';
import { Resume } from '../resume/entities/resume.entity';
import { Job, JobStatus } from '../job/entities/job.entity';
import { NotificationService } from '../notification/notification.service';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let mockAppRepo: any;
  let mockLogRepo: any;
  let mockNoteRepo: any;
  let mockResumeRepo: any;
  let mockJobRepo: any;
  let mockNotificationService: any;

  beforeEach(async () => {
    mockAppRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        getRawMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      })),
    };

    mockLogRepo = {
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
    };

    mockNoteRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
      remove: jest.fn(),
    };

    mockResumeRepo = {
      findOne: jest.fn(),
    };

    mockJobRepo = {
      findOne: jest.fn(),
      increment: jest.fn(),
      save: jest.fn(),
    };

    mockNotificationService = {
      create: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        { provide: getRepositoryToken(Application), useValue: mockAppRepo },
        { provide: getRepositoryToken(ApplicationStatusLog), useValue: mockLogRepo },
        { provide: getRepositoryToken(ApplicationNote), useValue: mockNoteRepo },
        { provide: getRepositoryToken(Resume), useValue: mockResumeRepo },
        { provide: getRepositoryToken(Job), useValue: mockJobRepo },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  // ====================================================================
  // Issue #1: 投递记录追踪不能自行修改状态
  // ====================================================================
  describe('Issue #1: Student cannot modify status of any application', () => {
    it('should throw ForbiddenException when student tries to update status of platform application (has jobId)', async () => {
      const platformApp = {
        id: 1,
        userId: 10,
        jobId: 5,
        status: ApplicationStatus.PENDING,
        company: 'Test Corp',
        position: 'Developer',
      };
      mockAppRepo.findOne.mockResolvedValue(platformApp);

      await expect(
        service.updateStatus(1, 10, { status: ApplicationStatus.FIRST_INTERVIEW }),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        service.updateStatus(1, 10, { status: ApplicationStatus.FIRST_INTERVIEW }),
      ).rejects.toThrow('投递状态由企业或管理员维护，学生不能自行修改');
    });

    it('should throw ForbiddenException when student tries to update status of manual application (no jobId)', async () => {
      const manualApp = {
        id: 2,
        userId: 10,
        jobId: null,
        status: ApplicationStatus.PENDING,
        tag: ApplicationTag.IN_PROGRESS,
        company: 'Manual Corp',
        position: 'Designer',
      };
      mockAppRepo.findOne.mockResolvedValue(manualApp);

      await expect(
        service.updateStatus(2, 10, { status: ApplicationStatus.FIRST_INTERVIEW }),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        service.updateStatus(2, 10, { status: ApplicationStatus.FIRST_INTERVIEW }),
      ).rejects.toThrow('投递状态由企业或管理员维护，学生不能自行修改');
    });

    it('should throw ForbiddenException when student tries to edit platform application', async () => {
      const platformApp = {
        id: 1,
        userId: 10,
        jobId: 5,
        status: ApplicationStatus.PENDING,
      };
      mockAppRepo.findOne.mockResolvedValue(platformApp);

      await expect(
        service.update(1, 10, { company: 'New Name' } as any),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        service.update(1, 10, { company: 'New Name' } as any),
      ).rejects.toThrow('平台职位投递记录不能手动编辑');
    });

    it('should throw ForbiddenException when student tries to delete platform application', async () => {
      const platformApp = {
        id: 1,
        userId: 10,
        jobId: 5,
        status: ApplicationStatus.PENDING,
      };
      mockAppRepo.findOne.mockResolvedValue(platformApp);

      await expect(service.remove(1, 10)).rejects.toThrow(ForbiddenException);
      await expect(service.remove(1, 10)).rejects.toThrow('平台职位投递记录不能删除');
    });

    it('should throw NotFoundException when application does not exist', async () => {
      mockAppRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus(999, 10, { status: ApplicationStatus.FIRST_INTERVIEW }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ====================================================================
  // Issue #5: checkIn and inquireResult validation
  // ====================================================================
  describe('Issue #5: CheckIn and InquireResult notifications', () => {
    it('should throw ForbiddenException when checking in on non-interview stage', async () => {
      const app = {
        id: 1,
        userId: 10,
        jobId: 5,
        status: ApplicationStatus.PENDING,
        nextDate: new Date('2020-01-01'),
      };
      mockAppRepo.findOne.mockResolvedValue(app);

      await expect(service.checkIn(1, 10, {})).rejects.toThrow(ForbiddenException);
      await expect(service.checkIn(1, 10, {})).rejects.toThrow('当前流程无需面试签到');
    });

    it('should throw ForbiddenException when checking in before scheduled date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const app = {
        id: 1,
        userId: 10,
        jobId: 5,
        status: ApplicationStatus.FIRST_INTERVIEW,
        nextDate: futureDate,
      };
      mockAppRepo.findOne.mockResolvedValue(app);

      await expect(service.checkIn(1, 10, {})).rejects.toThrow(ForbiddenException);
      await expect(service.checkIn(1, 10, {})).rejects.toThrow('未到签到时间');
    });

    it('should successfully check in when conditions are met', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const app = {
        id: 1,
        userId: 10,
        jobId: 5,
        status: ApplicationStatus.FIRST_INTERVIEW,
        nextDate: pastDate,
        company: 'Test Corp',
        position: 'Dev',
      };
      mockAppRepo.findOne.mockResolvedValue(app);
      mockLogRepo.find.mockResolvedValue([]);
      mockJobRepo.findOne.mockResolvedValue({ id: 5, userId: 20 });

      const result = await service.checkIn(1, 10, {});

      expect(result.success).toBe(true);
      expect(mockLogRepo.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when already checked in', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const stageStart = new Date();
      stageStart.setDate(stageStart.getDate() - 3);
      const app = {
        id: 1,
        userId: 10,
        jobId: 5,
        status: ApplicationStatus.FIRST_INTERVIEW,
        nextDate: pastDate,
        updatedAt: stageStart,
        createdAt: stageStart,
      };
      mockAppRepo.findOne.mockResolvedValue(app);
      // Simulate existing check-in log with a date after stageStart
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() - 1);
      mockLogRepo.find.mockResolvedValue([
        {
          id: 1,
          applicationId: 1,
          fromStatus: ApplicationStatus.FIRST_INTERVIEW,
          toStatus: ApplicationStatus.FIRST_INTERVIEW,
          note: '[面试签到] 候选人已完成一面签到',
          createdAt: checkInDate,
        },
      ]);

      await expect(service.checkIn(1, 10, {})).rejects.toThrow(ForbiddenException);
      await expect(service.checkIn(1, 10, {})).rejects.toThrow('本轮面试已完成签到');
    });

    it('should throw ForbiddenException when inquiring result without check-in', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2);
      const app = {
        id: 1,
        userId: 10,
        jobId: 5,
        status: ApplicationStatus.FIRST_INTERVIEW,
        nextDate: pastDate,
      };
      mockAppRepo.findOne.mockResolvedValue(app);
      mockLogRepo.find.mockResolvedValue([]);

      await expect(service.inquireResult(1, 10, {})).rejects.toThrow(ForbiddenException);
      await expect(service.inquireResult(1, 10, {})).rejects.toThrow('完成面试签到后才能询问结果');
    });
  });
});
