import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { RedisService } from '@common/redis/redis.service';
import { NotificationService } from '../notification/notification.service';
import { SystemService } from '../system/system.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockCompanyRepository: any;
  let mockJwtService: any;
  let mockRedisService: any;
  let mockNotificationService: any;
  let mockSystemService: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockCompanyRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock_jwt_token'),
    };

    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockNotificationService = {
      create: jest.fn().mockResolvedValue(null),
    };

    mockSystemService = {
      getPublicSettings: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Company), useValue: mockCompanyRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: SystemService, useValue: mockSystemService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    const registerDto = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
    };

    it('should register new user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      const createdUser = {
        id: 1, username: 'testuser', password: 'hashed_password',
        email: 'test@example.com', role: UserRole.STUDENT,
      };
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(result).not.toHaveProperty('password');
      expect(result.username).toBe('testuser');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    });

    it('should throw ConflictException when username exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1 });
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = {
      username: 'testuser',
      password: 'password123',
      captcha: 'abcd',
      captchaKey: 'test_key',
    };

    it('should login and return JWT token', async () => {
      mockRedisService.get.mockResolvedValue('abcd');
      const mockUser = {
        id: 1, username: 'testuser', password: 'hashed_password',
        nickname: 'Test', avatar: null, role: UserRole.STUDENT, isActive: true,
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.user.username).toBe('testuser');
      expect(mockRedisService.del).toHaveBeenCalled();
    });

    it('should throw BadRequestException when captcha expired', async () => {
      mockRedisService.get.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockRedisService.get.mockResolvedValue('abcd');
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      mockRedisService.get.mockResolvedValue('abcd');
      mockUserRepository.findOne.mockResolvedValue({
        id: 1, username: 'testuser', password: 'hashed', isActive: true,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when account is disabled', async () => {
      mockRedisService.get.mockResolvedValue('abcd');
      mockUserRepository.findOne.mockResolvedValue({
        id: 1, username: 'testuser', password: 'hashed', isActive: false,
      });
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
