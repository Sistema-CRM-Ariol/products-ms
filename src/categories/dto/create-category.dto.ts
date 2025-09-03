import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsBoolean({ message: "Debe ser un valor booleano" })
    isActive?: boolean;
}
