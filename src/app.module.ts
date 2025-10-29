import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { UnitModule } from './unit/unit.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [ProductModule, CategoryModule, OrderModule, UnitModule, UserModule, PaymentModule, StoreModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
