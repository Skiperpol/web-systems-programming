import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import 'reflect-metadata';
import { Context, Handler, Callback } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: true, // W środowisku deweloperskim możesz użyć 'true'
    // W środowisku produkcyjnym ustaw konkretną domenę frontendu, np.
    // origin: 'https://twoj-frontend.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  });

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });

}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (event.path === '' || event.path === undefined) event.path = '/';

  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
