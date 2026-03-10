/**
 * AuthService 单元测试
 * 测试用户注册和登录接口的核心逻辑
 */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

// 模拟 bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockJwtService: any;

  beforeEach(async () => {
    // 创建模拟的 UserRepository
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    // 创建模拟的 JwtService
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock_jwt_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register - 用户注册', () => {
    const registerDto = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
    };

    it('应该成功注册新用户', async () => {
      // 用户名不存在
      mockUserRepository.findOne.mockResolvedValue(null);
      // bcrypt 加密
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      // 创建和保存用户
      const createdUser = {
        id: 1,
        username: 'testuser',
        password: 'hashed_password',
        email: 'test@example.com',
        role: UserRole.STUDENT,
      };
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      // 验证结果不包含密码
      expect(result).not.toHaveProperty('password');
      expect(result.username).toBe('testuser');
      // 验证密码被加密
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
    });

    it('用户名已存在时应抛出 ConflictException', async () => {
      // 模拟用户名已存在
      mockUserRepository.findOne.mockResolvedValue({ id: 1, username: 'testuser' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login - 用户登录', () => {
    const loginDto = {
      username: 'testuser',
      password: 'password123',
    };

    it('应该成功登录并返回 JWT Token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashed_password',
        nickname: '测试用户',
        avatar: null,
        role: UserRole.STUDENT,
        isActive: true,
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.user.username).toBe('testuser');
      expect(result.user).not.toHaveProperty('password');
      // 验证 JWT payload 包含正确信息
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        username: 'testuser',
        role: UserRole.STUDENT,
      });
    });

    it('用户不存在时应抛出 UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('密码错误时应抛出 UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashed_password',
        isActive: true,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('账户被禁用时应抛出 UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashed_password',
        isActive: false,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
