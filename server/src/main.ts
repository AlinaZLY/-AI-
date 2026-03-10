/**
 * 应用入口文件
 * 负责创建 NestJS 应用实例并配置全局中间件
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 所有接口统一添加 /api 前缀
  app.setGlobalPrefix('api');

  // 全局参数验证管道：自动校验请求参数，过滤非白名单字段
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // 自动剥离 DTO 中未定义的属性
      transform: true,          // 自动将请求参数转换为 DTO 类型
      forbidNonWhitelisted: true, // 如果传了未定义的属性则报错
    }),
  );

  // 全局异常过滤器：统一异常响应格式
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局响应拦截器：统一成功响应格式 { code, message, data, timestamp }
  app.useGlobalInterceptors(new TransformInterceptor());

  // 启用跨域，允许前端项目访问
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`服务已启动，端口: ${port}`);
}
bootstrap();
