import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDto,
  LoginUserDto,
  RoleUser,
  UserPayload,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          username: loginDto.username,
        },
      });

      if (!findUser) {
        throw new NotFoundException({
          code: 'NOT_FOUND',
          message: 'User not found',
          data: null,
        });
      }

      const checkPassword = bcrypt.compareSync(
        loginDto.password,
        findUser.password,
      );

      if (!checkPassword) {
        throw new UnauthorizedException({
          code: 'BAD_REQUEST',
          message: 'Invalid password',
          data: null,
        });
      }

      const userPayload: UserPayload = {
        id: findUser.id,
        name: findUser.name,
        username: findUser.username,
        email: findUser.email,
        role: findUser.role as RoleUser,
      };

      const token = this.jwtService.sign(userPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '1h',
      });

      return {
        data: userPayload,
        token: token,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async detailUser(id: string) {
    try {
      const res = await this.prisma.user.findFirst({
        where: { id },
      });

      return {
        code: 'CREATED',
        message: 'Successfully get data user',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed checkout order',
        data: `${error}`,
      });
    }
  }

  logout(id: string) {
    try {
      return {
        code: 'SUCCESS',
        message: 'Logout successfully',
        data: null,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed checkout order',
        data: `${error}`,
      });
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
