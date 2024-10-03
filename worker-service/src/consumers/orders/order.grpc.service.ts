import { OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IOrderServiceGrpcMethods } from 'src/common/utils/interfaces';
// import { IOrderServiceGrpcMethods } from 'src/products/interfaces/product.interface';

export class OrdersGrpcService implements OnModuleInit {
  private productGrpcService: IOrderServiceGrpcMethods;
  constructor(@Inject('ORDER_PROTO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productGrpcService =
      this.client.getService<IOrderServiceGrpcMethods>('OrderService');
  }

  async updateOrder(id: string, data: any) {
    const response = await this.productGrpcService
      .UpdateOrder(id, {
        ...data,
      })
      .toPromise();
    const owner = JSON.parse(response);
    return owner;
  }
}
