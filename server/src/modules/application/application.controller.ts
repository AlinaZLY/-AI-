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
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Post()
  create(@Request() req, @Body() dto: CreateApplicationDto) {
    return this.applicationService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req, @Query() query: QueryApplicationDto) {
    return this.applicationService.findAll(req.user.id, query);
  }

  @Get('calendar')
  getCalendar(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.applicationService.getCalendar(req.user.id, startDate, endDate);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.applicationService.getStats(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(id, req.user.id, dto);
  }

  @Delete('notes/:noteId')
  deleteNote(@Param('noteId', ParseIntPipe) noteId: number, @Request() req) {
    return this.applicationService.deleteNote(noteId, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationService.remove(id, req.user.id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationService.updateStatus(id, req.user.id, dto);
  }

  @Get(':id/logs')
  getStatusLogs(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationService.getStatusLogs(id, req.user.id);
  }

  @Post(':id/notes')
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: CreateNoteDto,
  ) {
    return this.applicationService.addNote(id, req.user.id, dto);
  }

  @Get(':id/notes')
  getNotes(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationService.getNotes(id, req.user.id);
  }
}
