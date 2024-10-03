import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { Mongoose } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    JwtService,
    RabbitmqService,
    {
      provide: 'USER_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class UsersModule {}
