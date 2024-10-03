import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';

@Controller('ownersgrpc')
export class OwnersGrpcController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: { id: string }) {
    const { id } = data;
    const response = await this.userService.findById(id);
    const user = JSON.stringify(response);
    return { response: user };
  }

  @GrpcMethod('UserService', 'ValidateUserToken')
  async validateUserToken(data: { token: string }) {
    const { token } = data;
    const response = await this.authService.validateCurrentUser(token);
    const user = JSON.stringify(response);
    return { response: user };
  }
}
