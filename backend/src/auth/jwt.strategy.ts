import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name); // Add logger for better debugging

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    const secret = configService.get<string>('JWT_SECRET');
    this.logger.log(`JwtStrategy initialized.`);
    if (!secret) {
      this.logger.error(
        'CRITICAL FAILURE: JWT_SECRET is undefined or empty when initializing JwtStrategy. Authentication will not work.',
      );
    } else {
      this.logger.log('JWT_SECRET successfully loaded in JwtStrategy.');
    }
  }

  async validate(payload: any): Promise<any> {
    this.logger.log(
      `[JwtStrategy] Attempting to validate payload: ${JSON.stringify(payload)}`,
    );

    if (!payload || !payload.userId) {
      this.logger.warn(
        '[JwtStrategy] JWT payload is invalid or missing "userId".',
      );
      throw new UnauthorizedException(
        'Invalid token: User identifier missing from payload.',
      );
    }

    const user = await this.usersService.findOneById(payload.userId);
    if (!user) {
      this.logger.warn(
        `[JwtStrategy] User not found in database for userId: ${payload.userId} (from token).`,
      );

      throw new UnauthorizedException(
        'Invalid token: User not found or is inactive.',
      );
    }

    this.logger.log(
      `[JwtStrategy] User ${user.email} (ID: ${user.userId}) validated successfully.`,
    );

    return { userId: user.userId, email: user.email };
  }
}
