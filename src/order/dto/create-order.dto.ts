import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKE_AWAY = 'TAKE_AWAY',
  DELIVERY = 'DELIVERY',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

export class CreateOrderItemDto {
  @IsString() productId: string;
  @IsNumber() @Min(1) quantity: number;
  @IsNumber() @Min(0) price: number;
  @IsOptional() @IsString() note?: string;
}

export class CreateOrderDto {
  @IsString() waiterId: string;
  @IsString() customer: string;
  @IsString() @IsEnum(OrderType) orderType: OrderType;
  @IsNumber() @Min(0) totalPrice: number;
  @IsOptional() @IsString() address?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
