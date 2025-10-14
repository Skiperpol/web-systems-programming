import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['*'],
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

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
