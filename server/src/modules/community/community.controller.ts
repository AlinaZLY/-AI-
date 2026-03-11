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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

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
    return this.communityService.getPosts(query, userId);
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
