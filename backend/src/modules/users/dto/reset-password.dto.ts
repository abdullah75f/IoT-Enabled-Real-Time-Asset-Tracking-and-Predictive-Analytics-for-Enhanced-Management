import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Token is required.' })
  @IsString()
  token: string;

  @IsNotEmpty({ message: 'New password should not be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @IsString()
  newPassword: string;
}
