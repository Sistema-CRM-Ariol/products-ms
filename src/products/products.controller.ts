import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('createProduct')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern('findAllProducts')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern('findOneProduct')
  findOne(@Payload() id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern('updateProduct')
  update(@Payload() { id, updateProductDto }: {id: number, updateProductDto: UpdateProductDto}) {
    return this.productsService.update(id, updateProductDto);
  }

  @MessagePattern('removeProduct')
  remove(@Payload() id: string) {
    return this.productsService.remove(id);
  }

  
  @MessagePattern('seedProducts')
  seed() {
    return this.productsService.seed();
  }
}
