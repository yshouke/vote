import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor);

  //配置swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('选举投票系统-文档')  //文档标题
    .setDescription('接口-api-说明')  //文档描述
    .setVersion('1.0')  //文档版本
    .addBasicAuth() //鉴权，可以输入token
    .build(); //创建

  //创建swagger
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  //启动swagger
  SwaggerModule.setup('doc', app, document); //访问路径为 localhost:3000/doc

  await app.listen(3000);
}
bootstrap();
