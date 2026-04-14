import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SystemSetting } from './entities/system-setting.entity';
import { AiCallLog } from './entities/ai-call-log.entity';

type AiScene = 'resume_optimize' | 'interview_score' | 'interview_summary' | 'interview_generate' | 'ai_test';

interface AiRuntimeConfig {
  apiKey: string;
  baseUrl: string;
  modelId: string;
  temperature: number;
  timeoutMs: number;
}

interface ChatTextResult {
  content: string;
  model: string;
  tokens: number;
  duration: number;
}

@Injectable()
export class AiRuntimeService {
  private static readonly DEFAULT_VOLCANO_MODEL = 'doubao-1-5-pro-32k-250115';

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(SystemSetting)
    private readonly settingRepository: Repository<SystemSetting>,
    @InjectRepository(AiCallLog)
    private readonly aiLogRepository: Repository<AiCallLog>,
  ) {}

  async isConfigured() {
    const config = await this.getRuntimeConfig();
    return Boolean(config.apiKey && config.modelId);
  }

  async getRuntimeConfig(): Promise<AiRuntimeConfig> {
    const settings = await this.settingRepository.find({
      where: { key: In(['ark_api_key', 'ark_base_url', 'ark_model_id', 'ai_temperature', 'ai_timeout']) },
    });
    const map = new Map(settings.map((item) => [item.key, item.value]));

    const apiKey = map.get('ark_api_key') || this.configService.get<string>('ARK_API_KEY') || '';
    const baseUrl = map.get('ark_base_url') || 'https://ark.cn-beijing.volces.com/api/v3';
    const modelId =
      map.get('ark_model_id') ||
      this.configService.get<string>('ARK_MODEL_ID') ||
      AiRuntimeService.DEFAULT_VOLCANO_MODEL;
    const temperature = Number(map.get('ai_temperature') || 0.4);
    const timeoutSeconds = Number(map.get('ai_timeout') || 90);

    return {
      apiKey,
      baseUrl,
      modelId,
      temperature: Number.isFinite(temperature) ? temperature : 0.4,
      timeoutMs: Math.max(10, Number.isFinite(timeoutSeconds) ? timeoutSeconds : 90) * 1000,
    };
  }

  async chatText(options: {
    scene: AiScene;
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatTextResult> {
    const runtime = await this.getRuntimeConfig();
    if (!runtime.apiKey) {
      throw new Error('ARK_API_KEY 未配置');
    }
    if (!runtime.modelId) {
      throw new Error('ARK_MODEL_ID 未配置');
    }

    const startedAt = Date.now();
    try {
      const response = await fetch(`${runtime.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${runtime.apiKey}`,
        },
        body: JSON.stringify({
          model: runtime.modelId,
          temperature: options.temperature ?? runtime.temperature,
          max_tokens: options.maxTokens ?? 1200,
          messages: [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: options.userPrompt },
          ],
        }),
        signal: AbortSignal.timeout(runtime.timeoutMs),
      });

      const payload = await response.json().catch(() => ({} as any));
      if (!response.ok) {
        const errorMessage = payload?.error?.message || payload?.message || response.statusText;
        throw new Error(errorMessage);
      }

      const content = payload?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string') {
        throw new Error('模型未返回有效内容');
      }

      const duration = Date.now() - startedAt;
      const tokens = Number(payload?.usage?.total_tokens || 0);
      await this.logCall(options.scene, runtime.modelId, tokens, duration, 'success');

      return {
        content,
        model: payload?.model || runtime.modelId,
        tokens,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startedAt;
      await this.logCall(options.scene, runtime.modelId, 0, duration, 'failed', error?.message || '未知错误');
      throw error;
    }
  }

  async chatJson<T>(options: {
    scene: AiScene;
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<T> {
    const result = await this.chatText(options);
    const normalized = this.normalizeJsonText(result.content);
    return JSON.parse(normalized) as T;
  }

  private normalizeJsonText(text: string) {
    const trimmed = text.trim();
    if (trimmed.startsWith('```')) {
      return trimmed
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    }
    return trimmed;
  }

  private async logCall(
    scene: AiScene,
    model: string,
    tokens: number,
    duration: number,
    status: 'success' | 'failed',
    errorMessage?: string,
  ) {
    await this.aiLogRepository.save(
      this.aiLogRepository.create({
        scene,
        model,
        tokens,
        duration,
        status,
        errorMessage: errorMessage || '',
      }),
    );
  }
}
