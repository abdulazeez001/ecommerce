import { OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IOwnerServiceGrpcMethods } from 'src/products/interfaces/product.interface';

export class OwnersGrpcService implements OnModuleInit {
  private ownerGrpcService: IOwnerServiceGrpcMethods;
  constructor(@Inject('OWNER_PROTO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.ownerGrpcService =
      this.client.getService<IOwnerServiceGrpcMethods>('UserService');
  }

  async getCurrentUser(id: string) {
    const response = await this.ownerGrpcService
      .GetUser({
        id,
      })
      .toPromise();
    const owner = JSON.parse(response);
    return owner;
  }

  async validateUserToken(token: string) {
    const user = await this.ownerGrpcService
      .ValidateUserToken({
        token,
      })
      .toPromise();
    return user;
  }
}
