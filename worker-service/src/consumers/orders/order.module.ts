import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OwnersGrpcService } from './owner.grpc.service';
import { ProductsGrpcService } from './product.grpc.service';
import { OrdersGrpcService } from './order.grpc.service';
import { OrderWorkerService } from './order.consumer.service';
import { OrderService } from './order.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_PROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.ORDER_SERVICE_GRPC_HOST_PORT,
          package: 'orderserviceproto',
          protoPath: join(
            __dirname,
            '../../../grpc-proto-files/order-service/order.proto',
          ),
        },
      },
    ]),
  ],
  providers: [
    OrderService,
    OrderWorkerService,
    ConfigService,
    RabbitmqService,
    OwnersGrpcService,
    ProductsGrpcService,
    OrdersGrpcService,
  ],
  exports: [OrderWorkerService],
})
export class OrderModule {}
