import { OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IProductServiceGrpcMethods } from 'src/common/utils/interfaces';
// import { IProductServiceGrpcMethods } from 'src/products/interfaces/product.interface';

export class ProductsGrpcService implements OnModuleInit {
  private productGrpcService: IProductServiceGrpcMethods;
  constructor(@Inject('PRODUCT_PROTO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productGrpcService =
      this.client.getService<IProductServiceGrpcMethods>('ProductService');
  }

  async updateProduct(id: string, data: any) {
    const response = await this.productGrpcService
      .UpdateProduct(id, {
        ...data,
      })
      .toPromise();
    const owner = JSON.parse(response);
    return owner;
  }
}
