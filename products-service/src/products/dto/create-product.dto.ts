import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of Product', type: String })
  @IsString()
  @MinLength(2, { message: 'name must be at least two characters long' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Price of Product', type: String })
  @IsString()
  @MinLength(2, { message: 'price must be at least two characters long' })
  @IsNotEmpty()
  price: string;

  @ApiProperty({ description: 'Description of Product', type: String })
  @IsString()
  @MinLength(2, {
    message: 'description must be at least eight alphanumeric characters',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Product Owner', type: String })
  @IsString()
  @MinLength(2, { message: 'ownerid must be at least two characters long' })
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({ description: 'Product Owner Address', type: String })
  @IsString()
  @MinLength(2, {
    message: 'product owner address must be at least two characters long',
  })
  @IsNotEmpty()
  ownerAddress: string;
}
