import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({ description: 'Email', example: 'jon@gmail.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
