/**
 * 用户服务
 * 处理用户个人资料的查询、更新和密码修改逻辑
 */
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllAdmin(page = 1, pageSize = 10, keyword?: string, role?: string) {
    const qb = this.userRepository.createQueryBuilder('user');
    if (keyword) {
      qb.andWhere('(user.username LIKE :kw OR user.nickname LIKE :kw OR user.email LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }
    qb.orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async toggleUserActive(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    user.isActive = !user.isActive;
    return this.userRepository.save(user);
  }

  async adminCreateUser(data: { username: string; password: string; role?: UserRole; nickname?: string; email?: string; phone?: string; gender?: string; school?: string; major?: string; graduationYear?: number; degree?: string; jobIntention?: string; bio?: string; skills?: string[] }) {
    const existing = await this.userRepository.findOne({ where: { username: data.username } });
    if (existing) throw new ConflictException('用户名已存在');
    if (data.email) {
      const emailExists = await this.userRepository.findOne({ where: { email: data.email } });
      if (emailExists) throw new ConflictException('该邮箱已被使用');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || UserRole.STUDENT,
    });
    const saved = await this.userRepository.save(user);
    const { password: _, ...result } = saved;
    return result;
  }

  async adminUpdateUser(id: number, data: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    if (data.email && data.email !== user.email) {
      const emailExists = await this.userRepository.findOne({ where: { email: data.email } });
      if (emailExists && emailExists.id !== id) throw new ConflictException('该邮箱已被使用');
    }
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    Object.assign(user, data);
    const saved = await this.userRepository.save(user);
    const { password: _, ...result } = saved as any;
    return result;
  }

  async adminDeleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    await this.userRepository.remove(user);
    return { message: '删除成功' };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  /** 更新用户个人资料（只更新传入的字段） */
  async updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /** 获取用户个人资料 */
  async getProfile(id: number): Promise<User> {
    return this.findById(id);
  }

  /** 修改密码 — 先验证旧密码，再更新为新密码 */
  async changePassword(id: number, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证旧密码
    const isValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('旧密码错误');
    }

    // 加密新密码并保存
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(dto.newPassword, salt);
    await this.userRepository.save(user);

    return { message: '密码修改成功' };
  }
}
