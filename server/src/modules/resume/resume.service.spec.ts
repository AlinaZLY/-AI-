import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResumeService } from './resume.service';
import { Resume } from './entities/resume.entity';
import { ResumeTemplate } from './entities/resume-template.entity';
import { Job } from '../job/entities/job.entity';
import { AiRuntimeService } from '../system/ai-runtime.service';

describe('ResumeService', () => {
  let service: ResumeService;
  let mockResumeRepo: any;
  let mockTemplateRepo: any;
  let mockJobRepo: any;
  let mockConfigService: any;
  let mockAiRuntimeService: any;

  beforeEach(async () => {
    mockResumeRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        getMany: jest.fn().mockResolvedValue([]),
        getRawMany: jest.fn().mockResolvedValue([]),
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
      })),
    };

    mockTemplateRepo = {
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
      count: jest.fn().mockResolvedValue(0),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        getRawMany: jest.fn().mockResolvedValue([]),
      })),
    };

    mockJobRepo = {
      findOne: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue(null),
    };

    mockAiRuntimeService = {
      isConfigured: jest.fn().mockResolvedValue(false),
      chat: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumeService,
        { provide: getRepositoryToken(Resume), useValue: mockResumeRepo },
        { provide: getRepositoryToken(ResumeTemplate), useValue: mockTemplateRepo },
        { provide: getRepositoryToken(Job), useValue: mockJobRepo },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AiRuntimeService, useValue: mockAiRuntimeService },
      ],
    }).compile();

    service = module.get<ResumeService>(ResumeService);
  });

  // ====================================================================
  // Issue #8: AI 分析 after saving resume - error handling
  // ====================================================================
  describe('Issue #8: analyze() should handle empty/null content gracefully', () => {
    it('should not throw when resume content is null', async () => {
      const resume = {
        id: 1,
        userId: 10,
        title: 'Test Resume',
        content: null,
        targetPosition: null,
        analysisResult: null,
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockResumeRepo.save.mockImplementation((r) => Promise.resolve(r));

      const result = await service.analyze(1, 10);

      expect(result).toBeDefined();
      expect(result.completeness).toBe(0);
      expect(result.keywords).toEqual([]);
      expect(result.suggestions).toBeInstanceOf(Array);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should not throw when resume content is empty object', async () => {
      const resume = {
        id: 1,
        userId: 10,
        title: 'Test Resume',
        content: {},
        targetPosition: null,
        analysisResult: null,
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockResumeRepo.save.mockImplementation((r) => Promise.resolve(r));

      const result = await service.analyze(1, 10);

      expect(result).toBeDefined();
      expect(result.completeness).toBe(0);
      expect(result.suggestions).toContain('请填写姓名');
      expect(result.suggestions).toContain('请填写手机号');
    });

    it('should not throw when resume content is a string (malformed)', async () => {
      const resume = {
        id: 1,
        userId: 10,
        title: 'Test Resume',
        content: 'invalid string content' as any,
        targetPosition: null,
        analysisResult: null,
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockResumeRepo.save.mockImplementation((r) => Promise.resolve(r));

      const result = await service.analyze(1, 10);

      expect(result).toBeDefined();
      expect(result.completeness).toBe(0);
    });

    it('should handle skills array containing non-string values', async () => {
      const resume = {
        id: 1,
        userId: 10,
        title: 'Test Resume',
        content: {
          basicInfo: { name: '张三', phone: '138', email: 'a@b.com', school: '北大', major: '计算机' },
          skills: ['Vue', 123, null, { name: 'React' }, 'TypeScript', undefined, ''],
          education: [{ school: '北大' }],
          projects: [{ name: 'P1' }],
          selfIntro: '开发者',
        },
        targetPosition: null,
        analysisResult: null,
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockResumeRepo.save.mockImplementation((r) => Promise.resolve(r));

      const result = await service.analyze(1, 10);

      expect(result).toBeDefined();
      expect(result.keywords).toBeInstanceOf(Array);
      // Should only contain valid strings
      result.keywords.forEach((k: any) => {
        expect(typeof k).toBe('string');
        expect(k.length).toBeGreaterThan(0);
      });
      expect(result.keywords).toContain('Vue');
      expect(result.keywords).toContain('TypeScript');
      expect(result.keywords).not.toContain('');
    });

    it('should calculate completeness correctly with full content', async () => {
      const resume = {
        id: 1,
        userId: 10,
        title: 'Full Resume',
        content: {
          basicInfo: {
            name: '张三',
            phone: '13800138000',
            email: 'test@test.com',
            school: '清华大学',
            major: '计算机科学',
          },
          education: [{ school: '清华大学', major: 'CS', startDate: '2020', endDate: '2024' }],
          experience: [{ company: 'ByteDance', position: 'Intern', startDate: '2023', endDate: '2024', description: 'Dev' }],
          projects: [{ name: 'Project A', startDate: '2023', endDate: '2024', description: 'Built something' }],
          skills: ['Vue', 'TypeScript', 'Node.js'],
          selfIntro: '热爱技术的开发者',
        },
        targetPosition: '前端开发',
        analysisResult: null,
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockResumeRepo.save.mockImplementation((r) => Promise.resolve(r));

      const result = await service.analyze(1, 10);

      expect(result.completeness).toBe(100);
      expect(result.keywords).toContain('Vue');
      expect(result.keywords).toContain('TypeScript');
      expect(result.keywords).toContain('计算机科学');
    });

    it('should throw NotFoundException when resume does not exist', async () => {
      mockResumeRepo.findOne.mockResolvedValue(null);

      await expect(service.analyze(999, 10)).rejects.toThrow(NotFoundException);
    });

    it('should include job match analysis when jobDescription is provided', async () => {
      const resume = {
        id: 1,
        userId: 10,
        title: 'Test Resume',
        content: {
          basicInfo: { name: '张三', phone: '138', email: 'a@b.com', school: '北大', major: '计算机' },
          skills: ['Vue', 'TypeScript', 'React'],
          education: [{ school: '北大' }],
          projects: [{ name: 'P1' }],
          selfIntro: '前端开发者',
        },
        targetPosition: '前端开发',
        analysisResult: null,
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockResumeRepo.save.mockImplementation((r) => Promise.resolve(r));

      const result = await service.analyze(1, 10, {
        jobDescription: '需要熟悉 Vue TypeScript React Node.js 前端开发经验',
      });

      expect(result.jobMatchScore).not.toBeNull();
      expect(result.matchedKeywords).toBeInstanceOf(Array);
      expect(result.competitiveness).not.toBeNull();
    });

    it('should save analysis result to resume', async () => {
      const resume = {
        id: 1,
        userId: 10,
        title: 'Test',
        content: { basicInfo: { name: '张三' }, skills: ['Vue'] },
        targetPosition: null,
        analysisResult: null,
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockResumeRepo.save.mockImplementation((r) => Promise.resolve(r));

      await service.analyze(1, 10);

      expect(mockResumeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          analysisResult: expect.any(String),
        }),
      );
      const savedResume = mockResumeRepo.save.mock.calls[0][0];
      const parsed = JSON.parse(savedResume.analysisResult);
      expect(parsed).toHaveProperty('completeness');
      expect(parsed).toHaveProperty('score');
    });
  });

  // ====================================================================
  // Issue #9: Admin resume preview - renderResumeAdmin
  // ====================================================================
  describe('Issue #9: renderResumeAdmin() should work without userId check', () => {
    it('should render resume for admin without userId restriction', async () => {
      const resume = {
        id: 1,
        userId: 99, // different user
        title: 'Student Resume',
        templateId: 1,
        content: {
          basicInfo: { name: '李四', phone: '139', email: 'b@c.com', school: '北大', major: 'CS' },
          skills: ['Java'],
          selfIntro: 'Hello',
        },
      };
      const template = {
        id: 1,
        htmlContent: '<div class="resume"><h1>{{name}}</h1></div>',
        cssContent: 'body { font-family: sans-serif; }',
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockTemplateRepo.findOne.mockResolvedValue(template);

      const result = await service.renderResumeAdmin(1);

      expect(result).toBeDefined();
      expect(result.html).toBeDefined();
      expect(result.html).toContain('李四');
    });

    it('should throw NotFoundException when resume does not exist for admin render', async () => {
      mockResumeRepo.findOne.mockResolvedValue(null);

      await expect(service.renderResumeAdmin(999)).rejects.toThrow(NotFoundException);
    });

    it('should use default template when resume has no templateId', async () => {
      const resume = {
        id: 1,
        userId: 99,
        title: 'No Template Resume',
        templateId: null,
        content: { basicInfo: { name: '王五' } },
      };
      mockResumeRepo.findOne.mockResolvedValue(resume);
      mockTemplateRepo.findOne.mockResolvedValue(null); // template not found

      const result = await service.renderResumeAdmin(1);

      expect(result.html).toBeDefined();
      expect(result.html).toContain('王五');
    });

    it('renderResume should fail when userId does not match', async () => {
      // This verifies the original renderResume still checks userId
      mockResumeRepo.findOne.mockResolvedValue(null); // userId mismatch returns null

      await expect(service.renderResume(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  // ====================================================================
  // Issue #10: Resume editing - update method
  // ====================================================================
  describe('Issue #10: Resume update should work correctly', () => {
    it('should update resume content successfully', async () => {
      const existingResume = {
        id: 1,
        userId: 10,
        title: 'Old Title',
        content: { basicInfo: { name: '旧名字' } },
      };
      mockResumeRepo.findOne.mockResolvedValue(existingResume);
      mockResumeRepo.save.mockImplementation((r) => Promise.resolve(r));

      const updateDto = {
        title: 'New Title',
        content: {
          basicInfo: { name: '新名字', phone: '13800138000', email: 'new@test.com' },
          skills: ['Vue', 'React'],
        },
      };

      const result = await service.update(1, 10, updateDto as any);

      expect(mockResumeRepo.save).toHaveBeenCalled();
      expect(result.title).toBe('New Title');
    });

    it('should throw NotFoundException when resume does not belong to user', async () => {
      mockResumeRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update(1, 999, { title: 'Hack' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
