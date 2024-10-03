import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { PaginateModel, PaginateResult, ClientSession } from 'mongoose';
import { Order } from './interfaces/order.interface';
import { CacheService } from 'src/database/cache/cache.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_MODEL') private readonly orderModel: PaginateModel<Order>,
    private readonly cacheService: CacheService,
  ) {}

  async create(
    payload: CreateOrderDto,
    session: ClientSession,
  ): Promise<Order> {
    try {
      const { product_ids, quantity, total_price, products_hash } = payload;
      // const order_exists = await this.orderModel.findOne({
      //   email,
      // });
      // if (order_exists)
      //   throw new ConflictException('A order with this email already exists');
      const order = await new this.orderModel({
        product_ids,
        quantity,
        total_price,
        products_hash,
      }).save({ session });
      const data = order.toJSON();
      await this.cacheService.setCache(
        `order_${order.id}`,
        JSON.stringify(order),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findAll(payload: GetOrdersDto): Promise<PaginateResult<Order>> {
    try {
      const { page = 1, limit = 20 } = payload;
      const orders = await this.orderModel.paginate(
        {},
        {
          page,
          limit,
          sort: { createdAt: -1 },
        },
      );
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async findById(order_id: string): Promise<Order | null> {
    try {
      const order = await this.orderModel.findOne({ _id: order_id });
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      throw error;
    }
  }

  async update(orderId: string, payload: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.orderModel.findOneAndUpdate(
        { _id: orderId },
        { ...payload },
        { new: true },
      );
      if (!order) throw new NotFoundException('Order not found');

      await this.cacheService.setCache(
        `order_${order.id}`,
        JSON.stringify(order),
      );
      return order;
    } catch (error) {
      throw error;
    }
  }

  async remove(orderId: string): Promise<Order> {
    try {
      const order = await this.orderModel.findByIdAndDelete(orderId);
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      throw error;
    }
  }
}
