import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8000'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Web Systems Programming API')
    .setDescription(
      'API for managing products, warehouses, discounts, and clients',
    )
    .setVersion('1.0')
    .addTag('products', 'Product management operations')
    .addTag('warehouses', 'Warehouse management operations')
    .addTag('discounts', 'Discount management operations')
    .addTag('clients', 'Client management operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Web Systems API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg', // To wystarczy
  });

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
void bootstrap();
