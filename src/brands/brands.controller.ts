import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from 'src/common';
import { FilterPaginationDto } from 'src/common/dto/filter-pagination.dto';

@Controller()
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @MessagePattern('createBrand')
  create(@Payload() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @MessagePattern('findAllBrands')
  findAll(@Payload() filterPaginationDto: FilterPaginationDto) {
    return this.brandsService.findAll(filterPaginationDto);
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
