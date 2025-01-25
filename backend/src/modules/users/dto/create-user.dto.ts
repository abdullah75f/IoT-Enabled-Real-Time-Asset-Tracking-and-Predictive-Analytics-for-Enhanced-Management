import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { GenderEnum } from 'src/modules/enum/gender-enum';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
