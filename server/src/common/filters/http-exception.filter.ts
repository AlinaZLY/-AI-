/**
 * 全局异常过滤器
 * 捕获所有 HTTP 异常和未知异常，统一返回格式：
 * { code: 状态码, message: 错误信息, data: null, timestamp: 时间戳 }
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()  // 捕获所有类型的异常
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    // 如果是已知的 HTTP 异常，提取状态码和消息
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
    }

    // class-validator 返回的验证错误是数组，需要拼接为字符串
    if (Array.isArray(message)) {
      message = message.join('; ');
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
