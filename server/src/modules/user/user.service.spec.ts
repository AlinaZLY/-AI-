/**
 * UserService 单元测试
 * 测试用户资料查询和更新逻辑
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;

  const mockUser: Partial<User> = {
    id: 1,
    username: 'testuser',
    nickname: '测试用户',
    email: 'test@example.com',
    phone: '13800138000',
    avatar: undefined,
    role: UserRole.STUDENT,
    jobIntention: '前端开发',
    isActive: true,
  };

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('getProfile - 获取用户资料', () => {
    it('应该成功返回用户资料', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(1);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('用户不存在时应抛出 NotFoundException', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile - 更新用户资料', () => {
    it('应该成功更新用户昵称', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      const updatedUser = { ...mockUser, nickname: '新昵称' };
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, { nickname: '新昵称' });

      expect(result.nickname).toBe('新昵称');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('应该成功更新多个字段', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      const updatedUser = {
        ...mockUser,
        nickname: '新昵称',
        email: 'new@example.com',
        jobIntention: '全栈开发',
      };
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(1, {
        nickname: '新昵称',
        email: 'new@example.com',
        jobIntention: '全栈开发',
      });

      expect(result.nickname).toBe('新昵称');
      expect(result.email).toBe('new@example.com');
      expect(result.jobIntention).toBe('全栈开发');
    });

    it('更新不存在的用户应抛出 NotFoundException', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateProfile(999, { nickname: '新昵称' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
