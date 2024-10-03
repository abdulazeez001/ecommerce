import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Mongoose } from 'mongoose';
import { UserSchema } from 'src/users/schemas/user.schema';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY_TIME'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    UsersService,
    RabbitmqService,
    {
      provide: 'USER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Users', UserSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
