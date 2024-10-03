import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { PaginateModel, PaginateResult, ClientSession } from 'mongoose';
import { User, UserQuery } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: PaginateModel<User>,
    private readonly rabitmqService: RabbitmqService,
  ) {}

  async create(payload: CreateUserDto, session: ClientSession): Promise<User> {
    try {
      const { first_name, last_name, email, password } = payload;
      const user_exists = await this.userModel.findOne({
        email,
      });
      if (user_exists)
        throw new ConflictException('A user with this email already exists');
      const user = await new this.userModel({
        first_name,
        last_name,
        email,
        password,
      }).save({ session });
      const data = user.toJSON();

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findAll(payload: GetUsersDto): Promise<PaginateResult<User>> {
    try {
      const { page = 1, limit = 20 } = payload;
      const users = await this.userModel.paginate(
        {},
        {
          page,
          limit,
          sort: { createdAt: -1 },
        },
      );
      return users;
    } catch (error) {
      throw error;
    }
  }

  async findOne(query: UserQuery): Promise<User | null> {
    try {
      const { email } = query;
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findById(user_id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ _id: user_id }, '-password');
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, payload: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: userId },
        { ...payload },
        { new: true },
      );
      if (!user) throw new NotFoundException('User not found');

      await this.rabitmqService.publishMessage([
        {
          worker: 'product',
          message: {
            action: 'update',
            type: 'profile',
            data: {
              ...user,
            },
          },
        },
      ]);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete(userId);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw error;
    }
  }
}
