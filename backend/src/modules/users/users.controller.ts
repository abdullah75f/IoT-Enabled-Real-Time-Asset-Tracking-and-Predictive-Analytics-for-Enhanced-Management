import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import User from './user.entity';
import { UsersService } from './users.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    console.log('fucker:', signInDto);
    return this.userService.signIn(signInDto);
  }
}
