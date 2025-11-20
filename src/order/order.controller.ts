import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { AuthGuard } from 'src/user/guards/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout')
  @UseGuards(AuthGuard)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.checkout(createOrderDto);
  }

  @Get('/mostOrdered')
  @UseGuards(AuthGuard)
  getMostOrderedProducts() {
    return this.orderService.mostOrderedProduct();
  }

  @Patch('/status/:id')
  @UseGuards(AuthGuard)
  update(@Param('id') orderId: string, @Body() status: OrderStatus) {
    return this.orderService.updateStatusOrder(orderId, status);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findDetailOrder(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.orderService.findAll(paginationDto);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
