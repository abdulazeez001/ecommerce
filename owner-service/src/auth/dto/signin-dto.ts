import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EmailDto } from './email-dto';

export class SigninDto {
  @ApiProperty({ description: 'Email of User', type: EmailDto })
  @ValidateNested()
  @Type(() => EmailDto)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of User', type: String })
  @IsString()
  @MinLength(6, { message: 'password must be at least six characters long' })
  @IsNotEmpty()
  password: string;
}
