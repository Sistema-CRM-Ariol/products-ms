import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { PaginationDto } from 'src/common';

@Controller()
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @MessagePattern('createProvider')
  create(@Payload() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @MessagePattern('findAllProviders')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.providersService.findAll(paginationDto);
  }

  @MessagePattern('findOneProvider')
  findOne(@Payload() id: number) {
    return this.providersService.findOne(+id);
  }

  @MessagePattern('updateProvider')
  update(@Payload() { id, updateProviderDto }: {id: number, updateProviderDto: UpdateProviderDto}) {
    return this.providersService.update(+id, updateProviderDto);
  }

  @MessagePattern('removeProvider')
  remove(@Payload() id: number) {
    return this.providersService.remove(+id);
  }

  @MessagePattern('seedProviders')
  seed() {
    return this.providersService.seed();
  }
}
