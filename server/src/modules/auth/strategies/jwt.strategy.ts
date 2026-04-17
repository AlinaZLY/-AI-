/**
 * JWT 验证策略
 * Passport 使用此策略从请求头中提取并验证 JWT Token
 * 验证通过后将用户信息注入到 req.user 中
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Authorization: Bearer <token> 提取
      ignoreExpiration: false, // 不忽略过期时间
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * JWT 解析成功后的回调
   * 将 payload 中的用户信息返回，注入到 req.user
   */
  async validate(payload: { sub: number; username: string; role: string }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'username', 'role', 'isActive'],
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('登录状态已失效，请重新登录');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
