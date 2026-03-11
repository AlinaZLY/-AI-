/**
 * 用户控制器
 * 提供用户个人资料查询、更新、修改密码和头像上传接口
 * 所有接口均需要 JWT 认证
 */
import {
  Controller, Get, Put, Post, Body, UseGuards, Request,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as sharp from 'sharp';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** GET /api/user/profile - 获取当前登录用户的个人资料 */
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
    // 压缩图片至不超过 500KB
    const inputPath = file.path;
    const compressedName = `compressed-${file.filename.replace(extname(file.filename), '')}.webp`;
    const outputPath = join(process.cwd(), 'uploads', 'avatars', compressedName);

    let quality = 80;
    let buffer = await (sharp as any)(inputPath).resize(400, 400, { fit: 'cover' }).webp({ quality }).toBuffer();

    // 逐步降低质量直到 <= 500KB
    while (buffer.length > 500 * 1024 && quality > 10) {
      quality -= 10;
      buffer = await (sharp as any)(inputPath).resize(400, 400, { fit: 'cover' }).webp({ quality }).toBuffer();
    }

    require('fs').writeFileSync(outputPath, buffer);
    // 删除原始文件
    require('fs').unlinkSync(inputPath);

    const avatarUrl = `/uploads/avatars/${compressedName}`;
    return this.userService.updateProfile(req.user.id, { avatar: avatarUrl });
  }
}
