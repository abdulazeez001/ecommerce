import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ description: 'First Name of User', type: String })
  @IsString()
  @MinLength(2, { message: 'first_name must be at least two characters long' })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: 'Last Name of User', type: String })
  @IsString()
  @MinLength(2, { message: 'last_name must be at least two characters long' })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: 'Email of User', type: String })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of User', type: String })
  @IsString()
  @MinLength(8, {
    message: 'password must be at least eight alphanumeric characters',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Address of User', type: String })
  @IsString()
  @MinLength(2, { message: 'address must be at least two characters long' })
  @IsNotEmpty()
  address: string;
}
