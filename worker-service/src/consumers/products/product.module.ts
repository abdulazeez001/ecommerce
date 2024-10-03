import { Module, Global } from '@nestjs/common';
// import { ProductService } from './product.service';
// import { ProductWorkerService } from './product.worker.service';
// import { ProductsService } from 'src/products/products.service';
// import { OwnersGrpcService } from 'src/common/services/owners-grpc-client.service';
import { ConfigService } from '@nestjs/config';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OwnersGrpcService } from './owner.grpc.service';
import { ProductsGrpcService } from './product.grpc.service';
import { OrdersGrpcService } from './order.grpc.service';
import { ProductWorkerService } from './product.consumer.service';
import { ProductService } from './product.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_PROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.PRODUCT_SERVICE_GRPC_HOST_PORT,
          package: 'productserviceproto',
          protoPath: join(
            __dirname,
            '../../../../grpc-proto-files/product-service/product.proto',
          ),
        },
      },

      {
        name: 'OWNER_PROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.OWNER_SERVICE_GRPC_HOST_PORT,
          package: 'ownerserviceproto',
          protoPath: join(
            __dirname,
            '../../../../grpc-proto-files/owner-service/auth.proto',
          ),
        },
      },

      {
        name: 'ORDER_PROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.ORDER_SERVICE_GRPC_HOST_PORT,
          package: 'orderserviceproto',
          protoPath: join(
            __dirname,
            '../../../../grpc-proto-files/order-service/order.proto',
          ),
        },
      },
    ]),
  ],
  providers: [
    ProductService,
    ProductWorkerService,
    ConfigService,
    RabbitmqService,
    OwnersGrpcService,
    ProductsGrpcService,
    OrdersGrpcService,
  ],
  exports: [ProductWorkerService],
})
export class ProductModule {}
