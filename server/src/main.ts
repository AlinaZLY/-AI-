/**
 * 应用入口文件
 * 负责创建 NestJS 应用实例并配置全局中间件
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 增大请求体限制（默认 1MB 太小，头像等文件上传需要更大）
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // 仅公开展示类资源；证照、简历、语音等敏感文件通过受控接口访问。
  const publicUploadDirs = ['avatars', 'icons', 'posts', 'logos'];
  for (const dir of publicUploadDirs) {
    const uploadDir = join(process.cwd(), 'uploads', dir);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    app.useStaticAssets(uploadDir, { prefix: `/uploads/${dir}` });
  }

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

  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
    : ['http://localhost:3100', 'http://localhost:5173', 'http://127.0.0.1:3100', 'http://127.0.0.1:5173'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`服务已启动，端口: ${port}`);
}
bootstrap().catch((err) => {
  console.error('启动失败:', err);
  process.exit(1);
});
