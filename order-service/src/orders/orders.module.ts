import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Mongoose } from 'mongoose';
import { OrderSchema } from './schemas/order.schema';
import { DatabaseModule } from 'src/database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CacheModule } from 'src/database/cache/cache.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE', // Name of the gRPC package
        transport: Transport.GRPC,
        options: {
          package: 'orderserviceproto', // Package defined in your .proto file
          protoPath: join(
            __dirname,
            '../../../grpc-proto-files/order-service/order.proto',
          ), // Adjust the path as necessary
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    RabbitmqService,
    {
      provide: 'ORDER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Order', OrderSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class OrdersModule {}
