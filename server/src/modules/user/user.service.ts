/**
 * 用户服务
 * 处理用户个人资料的查询、更新和密码修改逻辑
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /** 根据 ID 查找用户，不存在则抛出 404 异常 */
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
