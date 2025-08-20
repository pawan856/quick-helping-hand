
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './common/validation.pipe';
import { HttpExceptionFilter } from './common/http-exception.filter';
import helmet from 'helmet';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(GlobalValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());
  app.enableCors();
  app.useGlobalGuards(new ThrottlerGuard());

  const config = new DocumentBuilder()
    .setTitle('Quick Helping Hand API')
    .setDescription('API documentation for the Healthcare Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
