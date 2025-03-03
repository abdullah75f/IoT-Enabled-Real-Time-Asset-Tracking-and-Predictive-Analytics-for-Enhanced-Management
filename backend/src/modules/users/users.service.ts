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
import * as crypto from 'crypto';
import User from './user.entity';
import { OAuth2Client } from 'google-auth-library';
import { SignInDto } from './dto/sign-in.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  private verificationTokens = new Map<string, any>(); // Store unverified users temporarily

  async createUser(createUserDto: any): Promise<{ message: string }> {
    const { email, password,phoneNumber, firstName, lastName, gender, age, address } =
      createUserDto;

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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Store user TEMPORARILY (not in DB yet)
    this.verificationTokens.set(verificationToken, {
      firstName,
      lastName,
      email,
      gender,
      phoneNumber,
      address,
      age,
      passwordHash: hashedPassword,
    });

    // Send verification email
    await this.sendVerificationEmail(email, verificationToken);

    return { message: 'A verification email has been sent to your email.' };
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://192.168.1.4:3000/users/verify-email?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
  }

  async verifyEmail(token: string, res: any) {
    const userData = this.verificationTokens.get(token);

    if (!userData) {
      return res.redirect('http://192.168.1.4:5173/sign-in?verified=true');
    }

    // Save user to database
    const user = this.userRepository.create({
      ...userData,
      isEmailVerified: true,
      emailVerificationToken: null,
    });

    await this.userRepository.save(user);
    this.verificationTokens.delete(token); // Remove from temporary storage

    // Redirect to frontend sign-in page
    return res.redirect('http://192.168.1.4:5173/sign-in?verified=true');
  }

  // async googleAuth(
  //   token: string,
  // ): Promise<{ accessToken: string; expiresIn: number }> {
  //   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  //   const ticket = await client.verifyIdToken({
  //     idToken: token,
  //     audience: process.env.GOOGLE_CLIENT_ID,
  //   });
  //   const payload = ticket.getPayload();

  //   if (!payload) {
  //     throw new UnauthorizedException('Google authentication failed');
  //   }

  //   const { email, given_name, family_name } = payload;
  //   let user = await this.userRepository.findOne({ where: { email } });

  //   if (!user) {
  //     user = this.userRepository.create({
  //       email,
  //       firstName: given_name,
  //       lastName: family_name,
  //       isEmailVerified: true,
  //     });
  //     await this.userRepository.save(user);
  //   }

  //   const accessToken = this.jwtService.sign({
  //     userId: user.userId,
  //     email: user.email,
  //   });
  //   return { accessToken, expiresIn: 3600 };
  // }

  // // async signIn(
  // //   signInDto: SignInDto,
  // // ): Promise<{ accessToken: string; expiresIn: number }> {
  // //   const { emailOrPhone, password } = signInDto;
  // //   const user = await this.userRepository.findOne({
  // //     where: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
  // //   });

  // //   if (!user) {
  // //     throw new UnauthorizedException('Invalid credentials.');
  // //   }

  // //   const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  // //   if (!isPasswordValid) {
  // //     throw new UnauthorizedException('Invalid credentials.');
  // //   }

  // //   const payload = { userId: user.userId, email: user.email };
  // //   const accessToken = this.jwtService.sign(payload);
  // //   const expiresIn = 3600;
  // // 

  // //   return { accessToken, expiresIn };
  // // }
}
