import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Mongoose } from 'mongoose';
import { ProductSchema } from './schemas/product.schema';
import { DatabaseModule } from 'src/database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OwnersGrpcService } from './grpc_services/owner/owner.grpc.service';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'OWNER_PROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.OWNER_SERVICE_GRPC_HOST_PORT,
          package: 'ownerserviceproto',
          protoPath: join(
            __dirname,
            '../../../grpc-proto-files/owner-service/auth.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    RabbitmqService,
    OwnersGrpcService,
    {
      provide: 'PRODUCT_MODEL',
      useFactory: (mongoose: Mongoose) =>
        mongoose.model('Product', ProductSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class ProductsModule {}
