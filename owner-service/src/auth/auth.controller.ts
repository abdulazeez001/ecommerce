import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin-dto';
import { SignupDto } from './dto/signup-dto';

@ApiTags('Auth')
@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a User Account' })
  @ApiBody({ type: SignupDto })
  @Post('/signup')
  async signUpUser(@Body() payload: SignupDto) {
    const response = await this.authService.signUpUser(payload);
    return {
      response: response,
      message: 'User created successfully!',
    };
  }

  @ApiOperation({ summary: 'Sign In' })
  @ApiBody({ type: SigninDto })
  @Post('/signin')
  async signIn(@Body() payload: SigninDto) {
    const response = await this.authService.signIn(payload);
    return {
      response: response,
      message: 'Signed in successfully!',
    };
  }
}
