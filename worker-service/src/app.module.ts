import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ConsumersModule } from './consumers/consumers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    RabbitMQModule,
    ConsumersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
