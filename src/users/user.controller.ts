import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('/register')
  async createNewThread(@Body() createUserDto: CreateUserDto) {

    try {
      const user = await this.userService.createOne(
        createUserDto.username,
        createUserDto.password,
        createUserDto.email,
      );

      if (user) {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      }
    } catch (err) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
