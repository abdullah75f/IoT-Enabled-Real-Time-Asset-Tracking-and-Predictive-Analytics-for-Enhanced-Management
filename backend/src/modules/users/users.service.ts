import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import User from './user.entity';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      email,
      phoneNumber,
      password,
      firstName,
      lastName,
      gender,
      age,
      address,
    } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException('A user with this email already exists.');
      }

      if (existingUser.phoneNumber === phoneNumber) {
        throw new BadRequestException(
          'A user with this phone number already exists.',
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      address,
      age: age.toString(),
      passwordHash: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const { emailOrPhone, password } = signInDto;
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { userId: user.userId, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = 3600;
    console.log('fucker:', signInDto);

    console.log('fucker:', accessToken);

    return { accessToken, expiresIn };
  }
}
