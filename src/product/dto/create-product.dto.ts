import { IsInt, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString() name: string;
  @IsInt() price: number;
  @IsInt() stock: number;
  @IsString() imageUrl: string;
  @IsString() categoryId: string;
  @IsString() unitId: string;
}
