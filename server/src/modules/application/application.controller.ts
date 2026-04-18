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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { AdminCreateApplicationDto } from './dto/admin-create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { ApplicationActionDto } from './dto/application-action.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getStatsAdmin() {
    return this.applicationService.getStatsAdmin();
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
    @Query('tag') tag?: string,
  ) {
    return this.applicationService.findAllAdmin(page || 1, pageSize || 10, keyword, status, tag);
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.applicationService.findOneAdmin(id);
  }

  @Post('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  createAdmin(@Body() dto: AdminCreateApplicationDto) {
    return this.applicationService.createAdmin(dto);
  }

  @Put('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationService.updateAdmin(id, dto);
  }

  @Delete('admin/notes/:noteId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteNoteAdmin(@Param('noteId', ParseIntPipe) noteId: number) {
    return this.applicationService.deleteNoteAdmin(noteId);
  }

  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  removeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.applicationService.removeAdmin(id);
  }

  @Put('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatusAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationService.updateStatusAdmin(id, dto);
  }

  @Get('admin/:id/logs')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getStatusLogsAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.applicationService.getStatusLogsAdmin(id);
  }

  @Post('admin/:id/notes')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  addNoteAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateNoteDto,
  ) {
    return this.applicationService.addNoteAdmin(id, dto);
  }

  @Get('admin/:id/notes')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getNotesAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.applicationService.getNotesAdmin(id);
  }

  @Get('company')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ENTERPRISE)
  findAllForCompany(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
    @Query('tag') tag?: string,
  ) {
    return this.applicationService.findAllForCompany(req.user.id, page || 1, pageSize || 10, keyword, status, tag);
  }

  @Get('company/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ENTERPRISE)
  getStatsForCompany(@Request() req) {
    return this.applicationService.getStatsForCompany(req.user.id);
  }

  @Put('company/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ENTERPRISE)
  updateStatusForCompany(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationService.updateStatusForCompany(id, req.user.id, dto);
  }

  @Post('company/:id/result')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ENTERPRISE)
  sendResultForCompany(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationService.sendResultForCompany(id, req.user.id, dto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  create(@Request() req, @Body() dto: CreateApplicationDto) {
    return this.applicationService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  findAll(@Request() req, @Query() query: QueryApplicationDto) {
    return this.applicationService.findAll(req.user.id, query);
  }

  @Get('calendar')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  getCalendar(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.applicationService.getCalendar(req.user.id, startDate, endDate);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  getStats(@Request() req) {
    return this.applicationService.getStats(req.user.id);
  }

  @Get('dashboard')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  getDashboard(@Request() req) {
    return this.applicationService.getDashboard(req.user.id);
  }

  @Post(':id/check-in')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  checkIn(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: ApplicationActionDto,
  ) {
    return this.applicationService.checkIn(id, req.user.id, dto);
  }

  @Post(':id/result-inquiry')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  inquireResult(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: ApplicationActionDto,
  ) {
    return this.applicationService.inquireResult(id, req.user.id, dto);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationService.findOne(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(id, req.user.id, dto);
  }

  @Delete('notes/:noteId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  deleteNote(@Param('noteId', ParseIntPipe) noteId: number, @Request() req) {
    return this.applicationService.deleteNote(noteId, req.user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationService.remove(id, req.user.id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationService.updateStatus(id, req.user.id, dto);
  }

  @Get(':id/logs')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  getStatusLogs(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationService.getStatusLogs(id, req.user.id);
  }

  @Post(':id/notes')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: CreateNoteDto,
  ) {
    return this.applicationService.addNote(id, req.user.id, dto);
  }

  @Get(':id/notes')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  getNotes(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationService.getNotes(id, req.user.id);
  }
}
