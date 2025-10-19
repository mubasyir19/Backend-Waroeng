import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString() name: string;
  @Type(() => Number) @IsNumber() price: number;
  @Type(() => Number) @IsNumber() stock: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsString() categoryId: string;
  @IsString() unitId: string;
}
