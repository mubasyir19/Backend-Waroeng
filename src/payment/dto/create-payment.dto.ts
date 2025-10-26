import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

enum PaymentMethod {
  CASH = 'CASH',
  QRIS = 'QRIS',
  TRANSFER_BANK = 'TRANSFER_BANK',
  E_WALLET = 'E_WALLET',
}

enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export class CreatePaymentDto {
  @IsString() orderId: string;
  @IsString() @IsEnum(PaymentMethod) method: PaymentMethod;
  @IsString() @IsOptional() provider: string;
  @IsNumber() amount: number;
  @IsNumber() @IsOptional() paidAmount: number;
  @IsNumber() @IsOptional() change: number;
  @IsString() @IsOptional() referenceNo: string;
  @IsString() @IsOptional() note: string;
  @IsString() @IsEnum(PaymentStatus) status: PaymentStatus;
}
