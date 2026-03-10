/**
 * 用户控制器
 * 提供用户个人资料的查询和更新接口
 * 所有接口均需要 JWT 认证
 */
import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard) // 整个控制器需要登录
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** GET /api/user/profile - 获取当前登录用户的个人资料 */
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  /** PUT /api/user/profile - 更新当前登录用户的个人资料 */
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.id, updateUserDto);
  }
}
