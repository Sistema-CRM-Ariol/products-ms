import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ProvidersModule } from './providers/providers.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';

@Module({
  imports: [ProductsModule, ProvidersModule, CategoriesModule, BrandsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
