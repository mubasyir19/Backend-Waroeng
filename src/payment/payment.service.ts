import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/prisma.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  async getDetailPayment(orderId: string) {
    try {
      const res = await this.prisma.payment.findFirst({
        where: {
          orderId: orderId,
        },
      });

      return {
        code: 'SUCCESS',
        message: 'Successfully get detail payment',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get detail payment',
        data: `${error}`,
      });
    }
  }

  async completePayment(orderId: string, dto: CreatePaymentDto) {
    try {
      const checkData = await this.orderService.findDetailOrder(orderId);
      if (!checkData) {
        return {
          code: 'NOT_FOUND',
          message: 'Order not found',
          data: null,
        };
      }

      const res = await this.prisma.payment.create({
        data: {
          orderId: dto.orderId,
          method: dto.method,
          provider: dto.provider,
          amount: dto.amount,
          paidAmount: dto.paidAmount,
          change: dto.change,
          referenceNo: dto.referenceNo,
          note: dto.note,
          status: 'SUCCESS',
        },
      });

      return {
        code: 'CREATED',
        message: 'Successfully complete payment order',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed complete payment',
        data: `${error}`,
      });
    }
  }
}
