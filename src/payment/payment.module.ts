import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [JwtModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, OrderService],
})
export class PaymentModule {}
