import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.checkout(createOrderDto);
  }

  @Patch('/status/:id')
  update(@Param('id') orderId: string, @Body() status: OrderStatus) {
    return this.orderService.updateStatusOrder(orderId, status);
  }

  @Post('/payment/:orderId')
  paymentOrder(
    @Param('id') orderId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.orderService.completePayment(orderId, createPaymentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findDetailOrder(id);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
