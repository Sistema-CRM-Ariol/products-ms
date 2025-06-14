import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    brandId?: string;

    @IsString()
    categoryId?: string;
    
    @IsString()
    description: string;
    
    @IsOptional()
    @IsString()
    image?: string;

    @IsNumber()
    pricePurchase: number;

    @IsNumber()
    priceSale: number;
    
    @IsString()
    serialNumber: string;
    
    @IsOptional()
    @IsString()
    slug?: string;

}
