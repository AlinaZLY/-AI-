/**
 * 认证服务
 * 处理用户注册和登录逻辑，包含密码加密和 JWT 签发
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   * 检查用户名唯一性，使用 bcrypt 加密密码后存入数据库
   */
  async register(registerDto: RegisterDto) {
    const { username, password, ...rest } = registerDto;

    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建用户
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      ...rest,
    });
    await this.userRepository.save(user);

    // 返回用户信息（不含密码）
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 用户登录
   * 验证用户名和密码，成功后签发 JWT Token
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 查找用户（包含密码字段）
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'role', 'nickname', 'avatar', 'isActive'],
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('账户已被禁用');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成 JWT
    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
}
