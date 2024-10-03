import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'First Name of User', type: String })
  @IsString()
  @MinLength(2, { message: 'first_name must be at least two characters long' })
  @IsNotEmpty()
  @IsOptional()
  first_name?: string;

  @ApiProperty({ description: 'Last Name of User', type: String })
  @IsString()
  @MinLength(2, { message: 'last_name must be at least two characters long' })
  @IsNotEmpty()
  @IsOptional()
  last_name?: string;
}
