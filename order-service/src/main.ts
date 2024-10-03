import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.GRPC_PORT)
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((error: ValidationError) => ({
            field: error.property,
            errors: Object.values(error.constraints || {}),
          })),
        );
      },
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  const config = new DocumentBuilder()
    .setTitle('Ecommerce App Order Service Documentation')
    .setDescription('Documentation for the Ecommerce order service')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors();
  // GRPC PORT
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'orderserviceproto',
      protoPath: join(
        __dirname,
        '../../grpc-proto-files/order-service/order.proto',
      ),
      url: `0.0.0.0:${process.env.GRPC_PORT}`,
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.NODE_ENV || 3000);
}
bootstrap();
