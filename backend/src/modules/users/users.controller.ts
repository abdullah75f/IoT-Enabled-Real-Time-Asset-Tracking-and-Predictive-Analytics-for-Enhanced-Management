import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Multer } from 'multer';
import { diskStorage } from 'multer';
import User from './user.entity';
import { UsersService } from './users.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('google-signup')
  async googleSignup(@Body('token') token: string) {
    return this.usersService.googleSignup(token);
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    return this.usersService.signIn(signInDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: User) {
    return this.usersService.getProfile(user.userId);
  }

  @Put('update-profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory to store files temporarily
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`,
          );
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async updateProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.userId; // From JWT
    const profilePictureUrl = await this.usersService.updateProfilePicture(
      userId,
      file,
    );
    return { profilePicture: profilePictureUrl };
  }
}
