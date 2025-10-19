import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { existsSync, renameSync, unlinkSync } from 'fs';
import { extname } from 'path';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findByCategory(categoryId: string) {
    try {
      if (categoryId === '' || categoryId === null) {
        return {
          code: 'NOT_FOUND',
          message: 'Category not found',
          data: null,
        };
      }
      const products = await this.prisma.product.findMany({
        where: { categoryId },
      });

      if (products.length === 0) {
        return {
          code: 'SUCCESS',
          message: 'Empty data',
          data: null,
        };
      }

      return {
        code: 'SUCCESS',
        message: 'Successfully get products',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get products',
        data: `${error}`,
      });
    }
  }

  async findById(id: string) {
    try {
      if (id === '' || id === null) {
        return {
          code: 'NOT_FOUND',
          message: 'Category not found',
          data: null,
        };
      }
      const product = await this.prisma.product.findFirst({
        where: { id },
      });

      if (!product) {
        return {
          code: 'NOT_FOUND',
          message: 'Empty data',
          data: null,
        };
      }

      return {
        code: 'SUCCESS',
        message: 'Successfully get product',
        data: product,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get product',
        data: `${error}`,
      });
    }
  }

  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    try {
      let imageUrl = dto.imageUrl;

      if (file) {
        imageUrl = `/uploads/products/${file.filename}`;
      }

      if (!imageUrl && !file) {
        throw new BadRequestException('Image is required');
      }

      const add = await this.prisma.product.create({
        data: {
          categoryId: dto.categoryId,
          unitId: dto.unitId,
          name: dto.name,
          price: +dto.price,
          stock: +dto.stock,
          imageUrl: imageUrl ?? '',
        },
      });

      return {
        code: 'CREATED',
        message: 'Successfully add product',
        data: add,
      };
    } catch (error) {
      console.log('(backend) terjadi error', error);
      throw new InternalServerErrorException({
        message: 'Failed add product',
        data: `${error}`,
      });
    }
  }

  async update(id: string, dto: UpdateProductDto, file?: Express.Multer.File) {
    try {
      // Cek id product
      if (id === '' || id === null) {
        return {
          code: 'BAD_REQUEST',
          message: 'Id product requried',
          data: null,
        };
      }

      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new BadRequestException('Product not found');
      }

      let imageUrl = dto.imageUrl;

      // if there is new file, generate file name with timestamp for bypass cache
      if (file) {
        const timestamp = Date.now();
        const uniqueSuffix = timestamp + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `product-${uniqueSuffix}${ext}`;

        imageUrl = `/uploads/products/${filename}`;

        // move file with new name
        const newPath = `./uploads/products/${filename}`;
        await this.moveFile(file.path, newPath);

        // Delete old image file
        if (existingProduct.imageUrl && existingProduct.imageUrl !== '') {
          const oldImagePath = `.${existingProduct.imageUrl}`;
          try {
            if (existsSync(oldImagePath)) {
              unlinkSync(oldImagePath);
            }
          } catch (fileError) {
            console.warn('Failed to delete old image:', fileError);
          }
        }
      }
      // if there is no new file, retain the existing imageUrl
      else if (!imageUrl) {
        imageUrl = existingProduct.imageUrl;
      }

      // Update product and send to database
      const edit = await this.prisma.product.update({
        where: { id },
        data: {
          categoryId: dto.categoryId,
          unitId: dto.unitId,
          name: dto.name,
          price: dto.price,
          stock: dto.stock,
          imageUrl: imageUrl ?? existingProduct.imageUrl,
        },
      });

      // Return response sukses
      return {
        code: 'CREATED',
        message: 'Successfully update product',
        data: edit,
      };
    } catch (error) {
      console.log('(backend) terjadi error', error);
      throw new InternalServerErrorException({
        message: 'Failed update product',
        data: `${error}`,
      });
    }
  }

  async remove(id: string) {
    try {
      // Cek id product
      if (id === '' || id === null) {
        return {
          code: 'BAD_REQUEST',
          message: 'Id product requried',
          data: null,
        };
      }
      // Hapus product
      const deletProduct = await this.prisma.product.delete({
        where: { id },
      });

      // Return response sukses
      return {
        code: 'CREATED',
        message: 'Successfully delete product',
        data: deletProduct,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed update product',
        data: `${error}`,
      });
    }
  }

  private async moveFile(oldPath: string, newPath: string): Promise<void> {
    return new Promise((resolve) => {
      renameSync(oldPath, newPath);
      resolve();
    });
  }
}
