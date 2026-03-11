/**
 * 系统设置服务
 * 管理平台全局配置项（网站名称等）
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './entities/system-setting.entity';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemSetting)
    private settingRepository: Repository<SystemSetting>,
  ) {}

  /** 获取所有系统设置 */
  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.settingRepository.find();
    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return result;
  }

  /** 获取单个配置项 */
  async getSetting(key: string): Promise<string | null> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    return setting ? setting.value : null;
  }

  /** 更新配置项（不存在则创建） */
  async updateSetting(key: string, value: string, description?: string): Promise<SystemSetting> {
    let setting = await this.settingRepository.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
    } else {
      setting = this.settingRepository.create({ key, value, description: description || '' });
    }
    return this.settingRepository.save(setting);
  }

  /** 批量更新配置 */
  async updateSettings(settings: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      await this.updateSetting(key, value);
    }
  }
}
