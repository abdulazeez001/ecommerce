import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { OwnersGrpcService } from 'src/products/grpc_services/owner/owner.grpc.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly ownersGrpcService: OwnersGrpcService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const { headers } = request;
      const token =
        headers.authorization && headers.authorization.split('Bearer ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is Required');
      }
      let user = await this.ownersGrpcService.validateUserToken(token);
      if (!token || !user) {
        throw new UnauthorizedException('Unauthorized');
      }
      user = JSON.parse(user.response);
      request.user = user;
      return true;
    } catch (error) {
      console.log({ error });
      throw new UnauthorizedException('Unauthorized');
      // throw error;
    }
  }
}
