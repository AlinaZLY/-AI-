import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDto } from './dto/query-job.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll(@Query() query: QueryJobDto) {
    return this.jobService.findAll(query);
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
    return this.jobService.findAllAdmin(page || 1, pageSize || 10, keyword, status);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.jobService.getStats();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyJobs(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.jobService.findByUser(req.user.id, page || 1, pageSize || 10);
  }

  // ==================== 职位收藏 ====================

  @Post('favorites/:id/toggle')
  @UseGuards(JwtAuthGuard)
  toggleFavorite(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.jobService.toggleFavorite(id, req.user.id);
  }

  @Get('favorites/my')
  @UseGuards(JwtAuthGuard)
  getMyFavorites(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.jobService.getUserFavorites(req.user.id, page || 1, pageSize || 10);
  }

  @Get('favorites/:id/check')
  @UseGuards(JwtAuthGuard)
  checkFavorite(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.jobService.checkFavorite(id, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ENTERPRISE, UserRole.ADMIN)
  create(@Request() req, @Body() dto: CreateJobDto) {
    return this.jobService.create(req.user.id, dto, req.user.role);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobService.update(id, req.user.id, dto, true);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobService.update(id, req.user.id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminRemove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.jobService.remove(id, req.user.id, true);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.jobService.remove(id, req.user.id);
  }
}
