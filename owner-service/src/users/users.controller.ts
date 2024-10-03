import {
  Controller,
  Get,
  Body,
  Put,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';

@ApiTags('Users')
@Controller('/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async findAll(@Query() payload: GetUsersDto) {
    const response = await this.usersService.findAll(payload);
    return {
      response: response,
      message: 'Users retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Get a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const response = await this.usersService.findById(userId);
    return {
      response: response,
      message: 'User retrieved successfully!',
    };
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ type: UpdateUserDto })
  @Put(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const response = await this.usersService.update(userId, updateUserDto);
    return {
      response: response,
      message: 'User updated successfully!',
    };
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    await this.usersService.remove(userId);
    return { response: {}, message: 'User removed successfully!' };
  }
}
