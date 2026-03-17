/**
 * 认证服务
 * 处理用户注册、登录和验证码逻辑，包含密码加密和 JWT 签发
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as svgCaptcha from 'svg-captcha';
import { User, UserRole } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '@common/redis/redis.service';
import { NotificationService } from '../notification/notification.service';
import { SystemService } from '../system/system.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private redisService: RedisService,
    private notificationService: NotificationService,
    private systemService: SystemService,
  ) {}

  /**
   * 用户注册
   * 检查用户名唯一性，使用 bcrypt 加密密码后存入数据库
   */
  async register(registerDto: RegisterDto) {
    const { username, password, email, phone, nickname, role } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    if (email) {
      const existingByEmail = await this.userRepository.findOne({
        where: { email },
      });
      if (existingByEmail) {
        throw new ConflictException('该邮箱已被注册');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const allowedRole = (role === UserRole.ENTERPRISE) ? UserRole.ENTERPRISE : UserRole.STUDENT;

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      phone,
      nickname,
      role: allowedRole,
    });
    await this.userRepository.save(user);

    this.sendWelcomeNotification(user.id).catch(() => {});

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 用户登录
   * 先校验验证码，再验证用户名和密码，成功后签发 JWT Token
   */
  async login(loginDto: LoginDto) {
    const { username, password, captcha, captchaKey, platform } = loginDto;

    // 校验验证码
    const cachedCaptcha = await this.redisService.get(`captcha:${captchaKey}`);
    if (!cachedCaptcha) {
      throw new BadRequestException('验证码已过期，请刷新');
    }
    if (cachedCaptcha.toLowerCase() !== captcha.toLowerCase()) {
      throw new BadRequestException('验证码错误');
    }
    // 验证码使用后立即删除，防止重复使用
    await this.redisService.del(`captcha:${captchaKey}`);

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

    // 管理后台只允许 admin 角色登录
    if (platform === 'admin' && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('无权访问管理后台');
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

  /**
   * 生成图形验证码
   * 使用 svg-captcha 生成 SVG 格式验证码，存入 Redis（有效期 5 分钟）
   */
  private async sendWelcomeNotification(userId: number) {
    const defaultMsg = '欢迎加入 AI 校园招聘平台！在这里你可以浏览校招职位、管理简历、模拟面试，祝你求职顺利！';
    let content = defaultMsg;
    try {
      const settings = await this.systemService.getPublicSettings();
      const customMsg = (settings as any)?.welcomeMessage;
      if (customMsg && typeof customMsg === 'string' && customMsg.trim()) {
        content = customMsg.trim();
      }
    } catch {}
    await this.notificationService.create({
      type: NotificationType.SYSTEM,
      userId,
      content,
    });
  }

  async generateCaptcha() {
    const a = Math.floor(Math.random() * 15) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    const num1 = op === '-' ? Math.max(a, b) : a;
    const num2 = op === '-' ? Math.min(a, b) : b;
    const answer = op === '+' ? num1 + num2 : num1 - num2;
    const expression = `${num1} ${op} ${num2} = ?`;

    const colors = ['#1677ff', '#4338ca', '#0891b2', '#059669', '#7c3aed'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="44" viewBox="0 0 130 44">
      <rect width="130" height="44" fill="#f8fafc" rx="8"/>
      <text x="65" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="${color}" letter-spacing="2">${expression}</text>
    </svg>`;

    const key = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    await this.redisService.set(`captcha:${key}`, String(answer), 300);

    return {
      captchaKey: key,
      captchaSvg: svg,
    };
  }
}
