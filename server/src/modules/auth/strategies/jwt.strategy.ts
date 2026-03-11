/**
 * JWT 验证策略
 * Passport 使用此策略从请求头中提取并验证 JWT Token
 * 验证通过后将用户信息注入到 req.user 中
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Authorization: Bearer <token> 提取
      ignoreExpiration: false, // 不忽略过期时间
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret', // JWT 签名密钥
    });
  }

  /**
   * JWT 解析成功后的回调
   * 将 payload 中的用户信息返回，注入到 req.user
   */
  async validate(payload: { sub: number; username: string; role: string }) {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
