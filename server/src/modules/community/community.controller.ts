import {
  Controller,
  Get,
  Post as HttpPost,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

// 确保图标上传目录存在
const iconsDir = join(process.cwd(), 'uploads', 'icons');
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // ==================== 分类管理 ====================

  /** 获取所有分类 */
  @Get('categories')
  getCategories() {
    return this.communityService.getCategories();
  }

  /** 创建分类（管理员） */
  @UseGuards(JwtAuthGuard)
  @HttpPost('categories')
  createCategory(@Body() body: { name: string; icon?: string; color?: string; description?: string; sort?: number }) {
    return this.communityService.createCategory(body);
  }

  /** 更新分类（管理员） */
  @UseGuards(JwtAuthGuard)
  @Put('categories/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; icon?: string; color?: string; description?: string; sort?: number },
  ) {
    return this.communityService.updateCategory(id, body);
  }

  /** 删除分类（管理员） */
  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.communityService.deleteCategory(id);
  }

  /** 上传分类图标 */
  @UseGuards(JwtAuthGuard)
  @HttpPost('categories/upload-icon')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'icons'),
      filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new Error('只支持 jpg/png/gif/webp/svg/ico 格式的图标'), false);
      }
    },
  }))
  uploadIcon(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/icons/${file.filename}` };
  }

  // ==================== 帖子 ====================

  /** 发布帖子 */
  @UseGuards(JwtAuthGuard)
  @HttpPost('posts')
  createPost(@Request() req, @Body() dto: CreatePostDto) {
    return this.communityService.createPost(req.user.id, dto);
  }

  /** 帖子列表（支持分页、分类筛选、关键词搜索） */
  @Get('posts')
  getPosts(@Query() query: QueryPostDto, @Request() req) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    return this.communityService.getPosts(query, userId, userRole);
  }

  /** 帖子详情 */
  @Get('posts/:id')
  getPostDetail(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user?.id;
    return this.communityService.getPostDetail(id, userId);
  }

  /** 编辑帖子（仅作者） */
  @UseGuards(JwtAuthGuard)
  @Put('posts/:id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdatePostDto,
  ) {
    return this.communityService.updatePost(id, req.user.id, dto);
  }

  /** 删除帖子（作者或管理员） */
  @UseGuards(JwtAuthGuard)
  @Delete('posts/:id')
  deletePost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.communityService.deletePost(id, req.user.id, req.user.role);
  }

  /** 审核帖子（仅管理员） */
  @UseGuards(JwtAuthGuard)
  @Put('posts/:id/review')
  reviewPost(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() body: { status: string; rejectReason?: string },
  ) {
    return this.communityService.reviewPost(id, req.user.role, body.status, body.rejectReason);
  }

  /** 切换帖子启用/关闭状态（仅管理员） */
  @UseGuards(JwtAuthGuard)
  @Put('posts/:id/toggle-enabled')
  togglePostEnabled(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.communityService.togglePostEnabled(id, req.user.role);
  }

  /** 点赞/取消点赞帖子 */
  @UseGuards(JwtAuthGuard)
  @HttpPost('posts/:id/like')
  togglePostLike(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.communityService.togglePostLike(id, req.user.id);
  }

  /** 收藏/取消收藏帖子 */
  @UseGuards(JwtAuthGuard)
  @HttpPost('posts/:id/favorite')
  togglePostFavorite(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.communityService.togglePostFavorite(id, req.user.id);
  }

  // ==================== 评论 ====================

  /** 管理员获取所有评论列表（分页） */
  @UseGuards(JwtAuthGuard)
  @Get('comments')
  getAllComments(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.communityService.getAllComments(page, pageSize, keyword);
  }

  /** 获取帖子评论列表 */
  @Get('posts/:id/comments')
  getComments(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user?.id;
    return this.communityService.getComments(id, userId);
  }

  /** 发表评论 */
  @UseGuards(JwtAuthGuard)
  @HttpPost('posts/:id/comments')
  createComment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.createComment(id, req.user.id, dto);
  }

  /** 删除评论（作者或管理员） */
  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  deleteComment(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.communityService.deleteComment(id, req.user.id, req.user.role);
  }

  /** 点赞/取消点赞评论 */
  @UseGuards(JwtAuthGuard)
  @HttpPost('comments/:id/like')
  toggleCommentLike(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.communityService.toggleCommentLike(id, req.user.id);
  }

  // ==================== 用户相关 ====================

  /** 我的帖子 */
  @UseGuards(JwtAuthGuard)
  @Get('my/posts')
  getMyPosts(@Request() req, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.communityService.getUserPosts(req.user.id, page, pageSize);
  }

  /** 我的收藏 */
  @UseGuards(JwtAuthGuard)
  @Get('my/favorites')
  getMyFavorites(@Request() req, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.communityService.getUserFavorites(req.user.id, page, pageSize);
  }
}
