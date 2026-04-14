import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Request, ParseIntPipe, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { InterviewService } from './interview.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  // ==================== 题库分类 ====================

  @Get('categories')
  getCategories() {
    return this.interviewService.getCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createCategory(@Body() body: { name: string; parentId?: number; type?: string; description?: string; sort?: number }) {
    return this.interviewService.createCategory(body);
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: { name?: string; parentId?: number; type?: string; description?: string; sort?: number }) {
    return this.interviewService.updateCategory(id, body);
  }

  @Post('categories/upload-cover')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'icons'),
      filename: (_req, file, cb) => {
        cb(null, `cat-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  uploadCategoryCover(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new (require('@nestjs/common').BadRequestException)('请上传文件');
    }
    return { url: `/uploads/icons/${file.filename}` };
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.deleteCategory(id);
  }

  // ==================== 题库 ====================

  @Get('questions')
  getQuestions(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('categoryId') categoryId?: number,
    @Query('difficulty') difficulty?: string,
    @Query('keyword') keyword?: string,
    @Query('source') source?: string,
    @Query('questionType') questionType?: string,
  ) {
    return this.interviewService.getQuestions(page || 1, pageSize || 10, categoryId, difficulty, keyword, source, questionType);
  }

  @Get('questions/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getQuestionsAdmin(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('categoryId') categoryId?: number,
    @Query('difficulty') difficulty?: string,
    @Query('keyword') keyword?: string,
    @Query('source') source?: string,
    @Query('questionType') questionType?: string,
    @Query('reviewStatus') reviewStatus?: string,
  ) {
    return this.interviewService.getQuestions(page || 1, pageSize || 10, categoryId, difficulty, keyword, source, questionType, reviewStatus, true);
  }

  @Get('questions/type-stats')
  getQuestionTypeStats() {
    return this.interviewService.getQuestionTypeStats();
  }

  @Post('questions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createQuestion(@Request() req, @Body() dto: CreateQuestionDto) {
    return this.interviewService.createQuestion(dto, req.user.id);
  }

  @Put('questions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateQuestion(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateQuestionDto) {
    return this.interviewService.updateQuestion(id, dto);
  }

  @Delete('questions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.deleteQuestion(id);
  }

  // ==================== 用户投稿题目 ====================

  @Post('questions/submit')
  @UseGuards(JwtAuthGuard)
  submitQuestion(@Request() req, @Body() dto: CreateQuestionDto) {
    return this.interviewService.submitUserQuestion(dto, req.user.id);
  }

  @Get('questions/my')
  @UseGuards(JwtAuthGuard)
  getMyQuestions(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.interviewService.getUserSubmittedQuestions(req.user.id, page || 1, pageSize || 10);
  }

  @Put('questions/:id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  reviewQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string; rejectReason?: string },
  ) {
    return this.interviewService.reviewQuestion(id, body.status, body.rejectReason);
  }

  // ==================== 管理员面试记录管理 ====================

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllInterviewsAdmin(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
  ) {
    return this.interviewService.getAllInterviewsAdmin(page || 1, pageSize || 10, keyword, status);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getInterviewStats() {
    return this.interviewService.getInterviewStats();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getInterviewDetailAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.getInterviewDetailAdmin(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteInterviewAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.interviewService.deleteInterviewAdmin(id);
  }

  // ==================== 模拟面试 ====================

  @Post('start')
  @UseGuards(JwtAuthGuard)
  startInterview(@Request() req, @Body() dto: StartInterviewDto) {
    return this.interviewService.startInterview(req.user.id, dto);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  getInterviews(@Request() req, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.interviewService.getInterviews(req.user.id, page || 1, pageSize || 10);
  }

  @Get('radar')
  @UseGuards(JwtAuthGuard)
  getRadarData(@Request() req) {
    return this.interviewService.getRadarData(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getInterviewDetail(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.interviewService.getInterviewDetail(id, req.user.id);
  }

  @Post(':id/questions/:questionId/answer')
  @UseGuards(JwtAuthGuard)
  submitAnswer(
    @Param('id', ParseIntPipe) id: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Request() req,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.interviewService.submitAnswer(id, questionId, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteInterview(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.interviewService.deleteInterview(id, req.user.id);
  }
}
