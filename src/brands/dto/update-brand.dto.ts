import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsOptional()
  id?: number;
  
  @IsString()
  nombre?: string;

  @IsString()
  description?: string;

}
