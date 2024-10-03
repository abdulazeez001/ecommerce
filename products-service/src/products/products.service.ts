import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { PaginateModel, PaginateResult } from 'mongoose';
import { Product, ProductQuery } from './interfaces/product.interface';
import runInTransaction from 'src/common/utils/runInTransaction';
import { OwnersGrpcService } from './grpc_services/owner/owner.grpc.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_MODEL')
    private readonly productModel: PaginateModel<Product>,
    private readonly rabitmqService: RabbitmqService,
    private readonly ownersGrpcService: OwnersGrpcService,
  ) {}

  async create(payload: CreateProductDto): Promise<Product> {
    try {
      const response = await runInTransaction(async (session) => {
        const { name, price, description, ownerId, ownerAddress } = payload;
        const product_exists = await this.productModel.findOne({
          name: name.toLowerCase(),
        });
        if (product_exists)
          throw new ConflictException(
            'A product with this email already exists',
          );
        const product = await new this.productModel({
          name,
          price,
          description,
          ownerId,
          ownerAddress,
        }).save({ session });
        const data = product.toJSON();

        return data;
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async findAll(payload: GetProductsDto): Promise<PaginateResult<Product>> {
    try {
      const { page = 1, limit = 20 } = payload;
      const products = await this.productModel.paginate(
        {},
        {
          page,
          limit,
          sort: { createdAt: -1 },
        },
      );
      return products;
    } catch (error) {
      throw error;
    }
  }

  async findOne(query: ProductQuery): Promise<Product | null> {
    try {
      const { name } = query;
      const product = await this.productModel.findOne({ name });
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw error;
    }
  }

  async findById(product_id: string): Promise<Product | null> {
    try {
      const product = await this.productModel.findOne(
        { _id: product_id },
        '-password',
      );
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw error;
    }
  }

  async update(productId: string, payload: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.productModel.findOneAndUpdate(
        { _id: productId },
        { ...payload },
        { new: true },
      );
      if (!product) throw new NotFoundException('Product not found');

      await this.rabitmqService.publishMessage([
        {
          worker: 'order',
          message: {
            action: 'update',
            type: 'product',
            data: {
              ...product,
            },
          },
        },
      ]);

      return product;
    } catch (error) {
      throw error;
    }
  }

  async remove(productId: string): Promise<Product> {
    try {
      const product = await this.productModel.findByIdAndDelete(productId);
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw error;
    }
  }
}
