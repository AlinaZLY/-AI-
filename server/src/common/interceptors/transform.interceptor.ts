/**
 * 全局响应转换拦截器
 * 将所有成功响应统一包装为标准格式：
 * { code: 200, message: '操作成功', data: 实际数据, timestamp: 时间戳 }
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** 统一 API 响应结构 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: '操作成功',
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
