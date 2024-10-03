import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ description: 'Name of Product', type: String })
  @IsString()
  @MinLength(2, { message: 'name must be at least two characters long' })
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Price of Product', type: String })
  @IsString()
  @MinLength(2, { message: 'price must be at least two characters long' })
  @IsNotEmpty()
  @IsOptional()
  price: string;

  @ApiProperty({ description: 'Description of Product', type: String })
  @IsString()
  @MinLength(2, {
    message: 'description must be at least eight alphanumeric characters',
  })
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Product Owner Address', type: String })
  @IsString()
  @MinLength(2, {
    message: 'product owner address must be at least two characters long',
  })
  @IsNotEmpty()
  @IsOptional()
  ownerAddress: string;
}
