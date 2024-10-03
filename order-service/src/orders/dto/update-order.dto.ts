import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Product IDs associated with the order',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  product_ids: string[];

  @ApiProperty({ description: 'Quantity of the products', type: String })
  @IsString()
  @IsNotEmpty()
  quantity: string;

  @ApiProperty({
    description: 'Total price of the order',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  total_price?: string;

  @ApiProperty({
    description: 'Hash of the products in the order',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  products_hash?: string;
}
