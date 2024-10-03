import {
  Controller,
  Get,
  Body,
  Put,
  Query,
  Param,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductOwner } from './interfaces/product.interface';
import { BearerTokenGuard } from 'src/common/guards/bearer.token.guards';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@UseGuards(BearerTokenGuard)
@Controller('/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ type: CreateProductDto })
  @Post()
  async create(
    @Body() payload: CreateProductDto,
    @CurrentUser() currentUser: ProductOwner,
  ) {
    const response = await this.productsService.create({
      ownerId: currentUser.id,
      ...payload,
    });
    return {
      response: response,
      message: 'Product created successfully!',
    };
  }

  @ApiOperation({ summary: 'Get products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async findAll(@Query() payload: GetProductsDto) {
    const response = await this.productsService.findAll(payload);
    return {
      response: response,
      message: 'Products retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Get a product' })
  @ApiParam({ name: 'productId', description: 'ID of the product' })
  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    const response = await this.productsService.findById(productId);
    return {
      response: response,
      message: 'Product retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'productId', description: 'ID of the product' })
  @ApiBody({ type: UpdateProductDto })
  @Put(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const response = await this.productsService.update(
      productId,
      updateProductDto,
    );
    return {
      response: response,
      message: 'Product updated successfully!',
    };
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'productId', description: 'ID of the product' })
  @Delete(':productId')
  async remove(@Param('productId') productId: string) {
    await this.productsService.remove(productId);
    return { response: {}, message: 'Product removed successfully!' };
  }
}
