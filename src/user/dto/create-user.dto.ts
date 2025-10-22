import { IsEmail, IsEnum, IsString } from 'class-validator';

export enum RoleUser {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export class CreateUserDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() username: string;
  @IsString() password: string;
  @IsEnum(RoleUser) role: RoleUser;
}

export class LoginUserDto {
  @IsString() username: string;
  @IsString() password: string;
}

export class UserPayload {
  @IsString() id: string;
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() username: string;
  @IsEnum(RoleUser) role: RoleUser;
}
