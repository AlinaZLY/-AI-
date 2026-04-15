/**
 * 用户控制器
 * 提供用户个人资料查询、更新、修改密码和头像上传接口
 * 所有接口均需要 JWT 认证
 */
import {
  Controller, Get, Put, Post, Delete, Body, Query, Param, UseGuards, Request,
  UseInterceptors, UploadedFile, BadRequestException, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as sharp from 'sharp';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUsers(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
    @Query('role') role?: string,
  ) {
    return this.userService.findAllAdmin(page || 1, pageSize || 10, keyword, role);
  }

  @Put('admin/:id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleUserActive(@Param('id', ParseIntPipe) id: number) {
    return this.userService.toggleUserActive(id);
  }

  @Post('admin/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminCreate(@Body() body: AdminCreateUserDto) {
    return this.userService.adminCreateUser(body);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminUpdate(@Param('id', ParseIntPipe) id: number, @Body() body: AdminUpdateUserDto) {
    return this.userService.adminUpdateUser(id, body);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.adminDeleteUser(id);
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.userService.getProfile(req.user.id);
  }

  /** PUT /api/user/profile - 更新当前登录用户的个人资料 */
  @Put('profile')
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.id, updateUserDto);
  }

  /** PUT /api/user/password - 修改密码 */
  @Put('password')
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.id, dto);
  }

  /** POST /api/user/avatar - 上传头像 */
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'avatars'),
      filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 最大 10MB
    fileFilter: (_req, file, cb) => {
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new Error('只支持 jpg/png/gif/webp 格式的图片'), false);
      }
    },
  }))
  async uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('请上传图片文件');
    const inputPath = file.path;
    const compressedName = `compressed-${file.filename.replace(extname(file.filename), '')}.webp`;
    const outputPath = join(process.cwd(), 'uploads', 'avatars', compressedName);

    let quality = 80;
    const sharpFn = (sharp as any).default || sharp;
    let buffer = await sharpFn(inputPath).resize(400, 400, { fit: 'cover' }).webp({ quality }).toBuffer();

    while (buffer.length > 500 * 1024 && quality > 10) {
      quality -= 10;
      buffer = await sharpFn(inputPath).resize(400, 400, { fit: 'cover' }).webp({ quality }).toBuffer();
    }

    const fs = await import('fs');
    fs.writeFileSync(outputPath, buffer);
    fs.unlinkSync(inputPath);

    const avatarUrl = `/uploads/avatars/${compressedName}`;
    return this.userService.updateProfile(req.user.id, { avatar: avatarUrl });
  }
}
