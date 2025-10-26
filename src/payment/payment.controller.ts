import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from 'src/user/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/detail/:orderId')
  @UseGuards(AuthGuard)
  detailPayment(@Param('orderId') orderId: string) {
    return this.paymentService.getDetailPayment(orderId);
  }

  @Post('/order/:orderId')
  @UseGuards(AuthGuard)
  paymentOrder(
    @Param('orderId') orderId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.completePayment(orderId, createPaymentDto);
  }
}
