import {
  Controller,
  Get,
  Post,
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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateResumeDto) {
    return this.resumeService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.resumeService.findAll(req.user.id);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
    @Query('userId') userId?: number,
  ) {
    return this.resumeService.findAllAdmin(page || 1, pageSize || 10, keyword, userId);
  }

  @Get('templates')
  getTemplates(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('category') category?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.resumeService.getTemplates(page || 1, pageSize || 20, category, keyword);
  }

  @Get('templates/categories')
  getTemplateCategories() {
    return this.resumeService.getTemplateCategories();
  }

  @Get('templates/:id')
  getTemplateDetail(@Param('id', ParseIntPipe) id: number) {
    return this.resumeService.getTemplateDetail(id);
  }

  @Post('templates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createTemplate(@Body() body: CreateTemplateDto) {
    return this.resumeService.createTemplate(body);
  }

  @Put('templates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateTemplate(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTemplateDto) {
    return this.resumeService.updateTemplate(id, body);
  }

  @Post('templates/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'resumes'),
      filename: (_req, file, cb) => {
        const uniqueName = `tpl-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (/\.(docx)$/i.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new Error('仅支持 .docx 格式的 Word 模板'), false);
      }
    },
  }))
  async uploadTemplate(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name?: string,
  ) {
    if (!file) {
      throw new BadRequestException('请上传 .docx 文件');
    }
    return this.resumeService.importTemplateFromDocx(file.path, name || file.originalname.replace('.docx', ''));
  }

  @Delete('templates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.resumeService.deleteTemplate(id);
  }

  @Post('item/:id/duplicate')
  @UseGuards(JwtAuthGuard)
  duplicate(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumeService.duplicate(id, req.user.id);
  }

  @Put('item/:id/default')
  @UseGuards(JwtAuthGuard)
  setDefault(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumeService.setDefault(id, req.user.id);
  }

  @Post('item/:id/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'resumes'),
      filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (/\.(pdf|doc|docx)$/i.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new Error('仅支持 PDF/DOC/DOCX 格式'), false);
      }
    },
  }))
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('请上传文件');
    }
    const filePath = `/uploads/resumes/${file.filename}`;
    return this.resumeService.saveFile(id, req.user.id, filePath);
  }

  @Post('item/:id/analyze')
  @UseGuards(JwtAuthGuard)
  analyze(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() body?: { jobDescription?: string; jobId?: number },
  ) {
    return this.resumeService.analyze(id, req.user.id, body);
  }

  @Post('item/:id/optimize')
  @UseGuards(JwtAuthGuard)
  optimize(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() body?: Record<string, any>,
  ) {
    return this.resumeService.optimize(id, req.user.id, body);
  }

  @Get('item/:id/render')
  @UseGuards(JwtAuthGuard)
  render(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumeService.renderResume(id, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumeService.findOne(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.resumeService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.resumeService.remove(id, req.user.id);
  }
}
