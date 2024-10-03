import {
  Controller,
  Get,
  Body,
  Put,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';

@ApiTags('Orders')
@Controller('/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Get orders' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async findAll(@Query() payload: GetOrdersDto) {
    const response = await this.ordersService.findAll(payload);
    return {
      response: response,
      message: 'Orders retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Get a order' })
  @ApiParam({ name: 'orderId', description: 'ID of the order' })
  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string) {
    const response = await this.ordersService.findById(orderId);
    return {
      response: response,
      message: 'Order retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Update a order' })
  @ApiParam({ name: 'orderId', description: 'ID of the order' })
  @ApiBody({ type: UpdateOrderDto })
  @Put(':orderId')
  async update(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const response = await this.ordersService.update(orderId, updateOrderDto);
    return {
      response: response,
      message: 'Order updated successfully!',
    };
  }

  @ApiOperation({ summary: 'Delete a order' })
  @ApiParam({ name: 'orderId', description: 'ID of the order' })
  @Delete(':orderId')
  async remove(@Param('orderId') orderId: string) {
    await this.ordersService.remove(orderId);
    return { response: {}, message: 'Order removed successfully!' };
  }
}
