import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import User from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
