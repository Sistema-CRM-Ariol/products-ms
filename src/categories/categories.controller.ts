import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterPaginationDto } from 'src/common/dto/filter-pagination.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern('createCategory')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern('findAllCategories')
  findAll(@Payload() filterPaginationDto: FilterPaginationDto) {
    return this.categoriesService.findAll(filterPaginationDto);
  }

  @MessagePattern('findOneCategory')
  findOne(@Payload() id: number) {
    return this.categoriesService.findOne(+id);
  }

  @MessagePattern('updateCategory')
  update(@Payload() {id,  updateCategoryDto}: {id: number, updateCategoryDto: UpdateCategoryDto} ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @MessagePattern('removeCategory')
  remove(@Payload() id: number) {
    return this.categoriesService.remove(+id);
  }

  @MessagePattern('seedCategories')
  seed() {
    return this.categoriesService.seed();
  }
}
