import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @MessagePattern('createBrand')
  create(@Payload() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @MessagePattern('findAllBrands')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.brandsService.findAll(paginationDto);
  }

  @MessagePattern('updateBrand')
  update(@Payload() { id, updateBrandDto }: {id: string, updateBrandDto: UpdateBrandDto}) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @MessagePattern('removeBrand')
  remove(@Payload() id: string) {
    return this.brandsService.remove(id);
  }

  @MessagePattern('seedBrands')
  seed() {
    return this.brandsService.seed();
  }
}
