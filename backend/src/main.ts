import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }));

    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });

    const config = new DocumentBuilder()
    .setTitle('HeroForce API')
    .setDescription('API para gerenciamento de projetos e heróis')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Projects')
    .addTag('Heroes')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
