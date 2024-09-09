import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Controller()
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @MessagePattern('createProvider')
  create(@Payload() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @MessagePattern('findAllProviders')
  findAll() {
    return this.providersService.findAll();
  }

  @MessagePattern('findOneProvider')
  findOne(@Payload() id: number) {
    return this.providersService.findOne(id);
  }

  @MessagePattern('updateProvider')
  update(@Payload() updateProviderDto: UpdateProviderDto) {
    return this.providersService.update(updateProviderDto.id, updateProviderDto);
  }

  @MessagePattern('removeProvider')
  remove(@Payload() id: number) {
    return this.providersService.remove(id);
  }
}
