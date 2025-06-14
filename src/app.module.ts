import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProductsModule, CategoriesModule, BrandsModule, PrismaModule],
})
export class AppModule {}
