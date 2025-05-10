import {
  BadRequestException,
  Injectable,
  Logger,
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
import * as fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  private verificationTokens = new Map<string, any>(); // Store unverified users temporarily
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async createUser(createUserDto: any): Promise<{ message: string }> {
    const {
      email,
      password,
      phoneNumber,
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
    const verificationLink = `http://192.168.1.6:3000/users/verify-email?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `<p>Thank you for signing up!</p><p>Click <a href="${verificationLink}">here</a> to verify your email address.</p><p>If you did not sign up for this account, you can safely ignore this email.</p>`,
    });
    this.logger.log(`Verification email successfully sent to ${email}`);
  }

  async verifyEmail(token: string, res: any) {
    // Using 'any' for res, or import Response from 'express'
    this.logger.log(`Attempting to verify email with token: ${token}`);
    const userData = this.verificationTokens.get(token);
    const appScheme = process.env.EXPO_APP_SCHEME || 'myapp';

    // --- Helper Function to create basic HTML page ---
    const createHtmlResponse = (
      title: string,
      message: string,
      includeOpenAppLink = false,
    ) => {
      let buttonHtml = '';
      // Only include the button if requested (i.e., on successful verification)
      if (includeOpenAppLink) {
        buttonHtml = `
          <div style="margin-top: 25px;">
            <a href="${appScheme}://" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 1em; font-weight: bold;">
              Open Mobile App
            </a>
            <p style="font-size: 0.9em; color: #777; margin-top: 10px;">(If the button doesn't work, please open the app manually.)</p>
          </div>
        `;
      }

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 90vh; background-color: #f0f2f5; margin: 0; padding: 15px; }
                .container { background-color: #fff; padding: 35px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 500px; width: 100%; }
                h1 { color: #1c1e21; margin-bottom: 20px; font-size: 1.8em; }
                p { color: #4b4f56; font-size: 1.1em; line-height: 1.6; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${title}</h1>
                <p>${message}</p>
                ${buttonHtml} {/* Inject the button HTML here */}
            </div>
        </body>
        </html>
      `;
    };
    // --- End Helper Function ---

    // 1. Handle Case: Invalid or Expired Token
    if (!userData) {
      this.logger.warn(
        `Invalid or expired verification token received: ${token}`,
      );
      this.verificationTokens.delete(token);
      const html = createHtmlResponse(
        'Verification Failed',
        'This verification link is invalid or has expired. Please try signing up again in the mobile app.',
      );
      return res.status(400).send(html);
    }

    this.logger.log(
      `Found user data for token: ${token}, email: ${userData.email}`,
    );

    // 2. Handle Case: Valid Token - Try to save the user
    try {
      const existingVerifiedUser = await this.userRepository.findOne({
        where: { email: userData.email, isEmailVerified: true },
      });

      if (existingVerifiedUser) {
        this.logger.log(`Email ${userData.email} is already verified.`);
        this.verificationTokens.delete(token);
        // Pass true to include the button even if already verified, as they might want to open the app
        const html = createHtmlResponse(
          'Already Verified',
          'Your email address has already been verified. You can sign in now.',
          true, // Include "Open App" button
        );
        return res.status(200).send(html);
      }

      const user = this.userRepository.create({
        ...userData,
        isEmailVerified: true,
        emailVerificationToken: null,
      });

      await this.userRepository.save(user);
      this.logger.log(
        `Successfully verified and saved user: ${userData.email}`,
      );
      this.verificationTokens.delete(token);

      // Send Success HTML Response with the "Open Mobile App" button
      const html = createHtmlResponse(
        'Verification Successful!',
        'Your email is verified. Click the button below to open the app and sign in.',
        true, // Include "Open App" button
      );
      return res.status(200).send(html);
    } catch (error) {
      // 3. Handle Case: Error during database save
      this.logger.error(
        `Error saving user during verification for token ${token}:`,
        error.stack,
      );
      this.verificationTokens.delete(token);
      const html = createHtmlResponse(
        'Verification Error',
        'An unexpected error occurred while verifying your email. Please try signing up again in the mobile app or contact support.',
      );
      return res.status(500).send(html);
    }
  }

  async googleSignup(token: string) {
    try {
      // Fetch user info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const userInfo = await userInfoResponse.json();

      const { email, given_name, family_name, id } = userInfo;

      // Check if user already exists
      let user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        // Create new user
        user = this.userRepository.create({
          email,
          firstName: given_name,
          lastName: family_name,
          googleId: id,
          isEmailVerified: true, // Google verifies the email
        });
        await this.userRepository.save(user);
      }

      // Generate JWT tokens
      const accessToken = this.jwtService.sign({
        userId: user.userId,
        email: user.email,
      });
      const refreshToken = this.jwtService.sign(
        { userId: user.userId },
        { expiresIn: '7d' },
      );

      return { accessToken, refreshToken, expiresIn: 3600 };
    } catch (error) {
      throw new UnauthorizedException('Google sign-up failed.');
    }
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Please Register before trying to login.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { userId: user.userId, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = 3600;

    return { accessToken, expiresIn };
  }

  async findOneById(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const {
      passwordHash,
      emailVerificationToken,
      googleId,
      isEmailVerified,
      createdAt,
      ...safeUserData
    } = user;
    return safeUserData;
  }

  async updateProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'profile_pictures',
        public_id: `user_${userId}`,
        overwrite: true,
        fetch_format: 'auto',
        quality: 'auto',
      });

      const profilePictureUrl = uploadResult.secure_url;

      await this.userRepository.update(
        { userId },
        {
          profilePicture: profilePictureUrl,
          lastUpdatedAt: new Date().toISOString(),
        },
      );

      await fs.unlink(file.path); // Clean up temporary file
      return profilePictureUrl;
    } catch (error) {
      await fs.unlink(file.path).catch(() => {}); // Clean up on error
      throw error;
    }
  }
}
