import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/auth.interfaces';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const { user_id, env, iat } = payload;
    console.log({ iat });
    if (env !== this.configService.get('NODE_ENV')) {
      throw new UnauthorizedException(`Invalid token for currenct environment`);
    }

    const user = await this.usersService.findById(user_id);
    if (!user) throw new UnauthorizedException('Invalid Token');

    return user;
  }
}
