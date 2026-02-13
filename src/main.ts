import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

    const config = new DocumentBuilder()
    .setTitle('Conversation Session API')
    .setDescription('Voice AI Conversation Service')
    .setVersion('1.0')
    .addTag('sessions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`Server started on http://localhost:${port}`);
  Logger.log(`Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
