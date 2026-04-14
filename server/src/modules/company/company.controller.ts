import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Request, ParseIntPipe,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { UpdateCompanyStatusDto } from './dto/update-status.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findAll(@Query() query: QueryCompanyDto) {
    return this.companyService.findAll(query);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
  ) {
    return this.companyService.findAllAdmin(page || 1, pageSize || 10, keyword, status);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.companyService.getStats();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyCompany(@Request() req) {
    return this.companyService.findByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOnePublic(id);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOneAdmin(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateCompanyDto) {
    return this.companyService.create(req.user.id, dto);
  }

  @Post('upload-cert')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'certs'),
      filename: (_req, file, cb) => {
        const uniqueName = `cert-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (/\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new Error('仅支持 jpg/png/gif/webp/pdf 格式'), false);
      }
    },
  }))
  uploadCert(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('请上传文件');
    return { url: `/uploads/certs/${file.filename}` };
  }

  @Put('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyStatusDto,
  ) {
    return this.companyService.updateStatus(id, dto.status, dto.rejectReason);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, req.user.id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.remove(id);
  }
}
