import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninDto } from './dto/signin-dto';
import { UsersService } from 'src/users/users.service';
import runInTransaction from 'src/common/utils/runInTransaction';
import { User } from 'src/users/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/auth.interfaces';
import { SignupDto } from './dto/signup-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUpUser(payload: SignupDto): Promise<User> {
    try {
      const response = await runInTransaction(async (session) => {
        const { email, password } = payload;
        const user = await this.usersService.findOne({ email });
        if (user) {
          throw new ConflictException('A User with this email already exists');
        }

        const hashed_password = await bcrypt.hash(password, 10);
        payload.password = hashed_password;
        const new_user = await this.usersService.create(payload, session);
        delete new_user.password;
        return new_user;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signIn(payload: SigninDto) {
    try {
      const { email, password } = payload;

      const user = await this.usersService.findOne({
        email,
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password as string,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign({
        user_id: user.id,
        env: this.configService.get('NODE_ENV'),
        iat: Math.floor(new Date().getTime() / 1000),
      });

      const data = user.toJSON();
      delete data!.password;
      return { user: data, token };
    } catch (error) {
      throw error;
    }
  }

  async validateCurrentUser(token: string) {
    try {
      const secret = this.configService.get('JWT_SECRET');
      const valid: JwtPayload = this.jwtService.verify(token, { secret });
      if (!valid) throw new UnauthorizedException('Invalid credentials');
      const { user_id, env } = valid;
      if (env !== this.configService.get('NODE_ENV')) {
        throw new UnauthorizedException(
          `You cannot use ${env} tokens for ${this.configService.get('NODE_ENV')} environment`,
        );
      }
      const user = await this.usersService.findById(user_id);
      if (!user) throw new UnauthorizedException('Invalid credentials');
      return user;
    } catch (error) {
      throw error;
    }
  }
}
