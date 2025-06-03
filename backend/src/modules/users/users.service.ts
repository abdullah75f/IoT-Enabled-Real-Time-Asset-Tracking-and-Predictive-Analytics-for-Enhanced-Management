import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Not, IsNull } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import User from './user.entity';
import { OAuth2Client } from 'google-auth-library';
import { SignInDto } from './dto/sign-in.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';

import * as fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import { GenderEnum } from '../enum/gender-enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  private verificationTokens = new Map<string, any>();
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

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

    await this.sendVerificationEmail(email, verificationToken);

    return { message: 'A verification email has been sent to your email.' };
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://10.5.90.211:3000/users/verify-email?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `<p>Thank you for signing up!</p><p>Click <a href="${verificationLink}">here</a> to verify your email address.</p><p>If you did not sign up for this account, you can safely ignore this email.</p>`,
    });
    this.logger.log(`Verification email successfully sent to ${email}`);
  }

  async verifyEmail(token: string, res: any) {
    this.logger.log(`Attempting to verify email with token: ${token}`);
    const userData = this.verificationTokens.get(token);
    const appScheme = process.env.EXPO_APP_SCHEME || 'myapp';

    const createHtmlResponse = (
      title: string,
      message: string,
      includeOpenAppLink = false,
    ) => {
      let buttonHtml = '';

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

    try {
      const existingVerifiedUser = await this.userRepository.findOne({
        where: { email: userData.email, isEmailVerified: true },
      });

      if (existingVerifiedUser) {
        this.logger.log(`Email ${userData.email} is already verified.`);
        this.verificationTokens.delete(token);

        const html = createHtmlResponse(
          'Already Verified',
          'Your email address has already been verified. You can sign in now.',
          true,
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

      const html = createHtmlResponse(
        'Verification Successful!',
        'Your email is verified. Click the button below to open the app and sign in.',
        true,
      );
      return res.status(200).send(html);
    } catch (error) {
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
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const userInfo = await userInfoResponse.json();

      const { email, given_name, family_name, id } = userInfo;

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

  async updateProfile(
    userId: string,
    updateData: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      gender: string;
      age: string;
      address: string;
    },
  ) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.firstName = updateData.firstName;
    user.lastName = updateData.lastName;
    user.email = updateData.email;
    user.phoneNumber = updateData.phoneNumber;
    user.gender = updateData.gender as GenderEnum;
    user.address = updateData.address;

    user.lastUpdatedAt = new Date();

    await this.userRepository.save(user);
    const { passwordHash, ...result } = user;
    return result;
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    this.logger.log(`Password reset requested for email: ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
      );
      return {
        message:
          'If an account with this email exists, a password reset token has been sent.',
      };
    }

    if (user.googleId && !user.passwordHash) {
      this.logger.warn(
        `Password reset attempted for Google-linked account without password: ${email}`,
      );
      return {
        message:
          'This account is linked with Google. Please sign in using Google.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10); // Store hash

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);

    user.passwordResetToken = hashedResetToken;
    user.passwordResetTokenExpires = expiryDate;
    user.lastUpdatedAt = new Date();

    try {
      await this.userRepository.save(user);
      await this.sendPasswordResetEmail(user.email, resetToken);
      this.logger.log(`Password reset email successfully sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to save password reset token or send email for ${email}:`,
        error.stack,
      );
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await this.userRepository
        .save(user)
        .catch((err) =>
          this.logger.error(
            `Failed to clear reset token for ${email} after error: ${err.stack}`,
          ),
        );
      throw new InternalServerErrorException(
        'Could not process password reset request.',
      );
    }

    return {
      message:
        'If an account with this email exists, a password reset token has been sent.',
    };
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const instruction = `Use the following token in the app to reset your password: ${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        text: `You requested a password reset. ${instruction}\nThis token is valid for 15 minutes. If you did not request this, please ignore this email.`,
        html: `<p>You requested a password reset.</p><p>${instruction}</p><p>This token is valid for <b>15 minutes</b>.</p><p>If you did not request this, please ignore this email.</p>`,
      });
      this.logger.log(`Password reset email successfully sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}:`,
        error.stack,
      );

      throw new InternalServerErrorException(
        'Could not send password reset email.',
      );
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;
    this.logger.log(`Attempting password reset with a token.`);
    const usersWithTokens = await this.userRepository.find({
      where: { passwordResetToken: Not(IsNull()) },
    });

    let user: User | null = null;

    for (const potentialUser of usersWithTokens) {
      if (
        potentialUser.passwordResetToken &&
        (await bcrypt.compare(token, potentialUser.passwordResetToken))
      ) {
        user = potentialUser;
        break;
      }
    }

    if (
      !user ||
      !user.passwordResetTokenExpires ||
      user.passwordResetTokenExpires < new Date()
    ) {
      this.logger.warn(`Password reset attempt with invalid or expired token.`);
      // If user found but token expired, clear the token
      if (user) {
        user.passwordResetToken = null;
        user.passwordResetTokenExpires = null;
        await this.userRepository
          .save(user)
          .catch((e) => this.logger.error('Error clearing expired token'));
      }
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update user
    user.passwordHash = newPasswordHash;
    user.passwordResetToken = null; // Clear token after use
    user.passwordResetTokenExpires = null;
    user.lastUpdatedAt = new Date(); // Update timestamp

    try {
      await this.userRepository.save(user);
      this.logger.log(`Password successfully reset for user ${user.email}`);
      // Optionally send a confirmation email here
    } catch (error) {
      this.logger.error(
        `Failed to save new password for user ${user.email}:`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not reset password.');
    }

    return {
      message:
        'Password successfully reset. You can now sign in with your new password.',
    };
  }
}
