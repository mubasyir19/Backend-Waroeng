import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

interface CustomResponse extends Response {
  cookie(name: string, value: string, options?: any): CustomResponse;
  clearCookie(name: string, options?: any): CustomResponse;
}

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  async loginUser(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: CustomResponse,
  ) {
    const result = await this.userService.login(loginDto);

    const { data, token } = result;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    return {
      code: 'SUCCESS',
      message: 'Login successfully',
      data: data,
    };
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logoutUser(@Res({ passthrough: true }) res: CustomResponse) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      code: 'SUCCESS',
      message: 'Logout successfully',
      data: null,
    };
  }

  @Get('/profile')
  getProfile(@Req() req: Request) {
    const token = req.cookies?.token;
    if (!token) {
      throw new UnauthorizedException('No token found in cookies');
    }

    try {
      // Verify token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      return {
        code: 'SUCCESS',
        message: 'Profile data',
        data: decoded,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get('/check-cookie')
  checkCookie(@Req() req: Request) {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'No token cookie found',
        data: null,
      });
    }

    return {
      code: 'SUCCESS',
      message: 'Cookie check successful',
      data: {
        hasToken: true,
        tokenLength: token.length,
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
