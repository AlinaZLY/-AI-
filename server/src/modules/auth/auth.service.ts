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
import { Company, CompanyStatus } from '../company/entities/company.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '@common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  /**
   * 用户注册
   * 检查用户名唯一性，使用 bcrypt 加密密码后存入数据库
   */
  async register(registerDto: RegisterDto) {
    const { username, password, enterpriseInfo, ...rest } = registerDto;

    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱唯一性
    if (rest.email) {
      const emailExists = await this.userRepository.findOne({ where: { email: rest.email } });
      if (emailExists) {
        throw new ConflictException('该邮箱已被使用');
      }
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

    // 企业用户注册时同步创建企业认证记录（pending 状态）
    let companyRecord: Company | null = null;
    if (rest.role === UserRole.ENTERPRISE && enterpriseInfo?.name) {
      const company = this.companyRepository.create({
        userId: user.id,
        name: enterpriseInfo.name,
        type: enterpriseInfo.type || 'company',
        legalPerson: enterpriseInfo.legalPerson,
        creditCode: enterpriseInfo.creditCode,
        industry: enterpriseInfo.industry,
        contactPhone: enterpriseInfo.contactPhone,
        businessLicense: enterpriseInfo.businessLicense,
        idCardFront: enterpriseInfo.idCardFront,
        idCardBack: enterpriseInfo.idCardBack,
        status: CompanyStatus.PENDING,
        isVerified: false,
      });
      companyRecord = await this.companyRepository.save(company);
    }

    // 返回用户信息（不含密码）
    const { password: _, ...result } = user;
    return {
      ...result,
      ...(companyRecord ? { companyId: companyRecord.id, certStatus: companyRecord.status } : {}),
    };
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
  async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4,         // 验证码长度
      noise: 3,        // 干扰线数量
      color: true,     // 彩色
      width: 120,
      height: 40,
      fontSize: 40,
    });

    // 生成唯一 key
    const key = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 存入 Redis，有效期 5 分钟
    await this.redisService.set(`captcha:${key}`, captcha.text, 300);

    return {
      captchaKey: key,
      captchaSvg: captcha.data,
    };
  }
}
