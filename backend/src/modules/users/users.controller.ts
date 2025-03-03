import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import User from './user.entity';
import { UsersService } from './users.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res) {
    return this.usersService.verifyEmail(token, res);
  }

  // @Post('signin')
  // async signIn(
  //   @Body() signInDto: SignInDto,
  // ): Promise<{ accessToken: string; expiresIn: number }> {
  //   return this.userService.signIn(signInDto);
  // }
}
