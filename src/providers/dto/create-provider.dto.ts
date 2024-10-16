import { IsOptional, IsString } from "class-validator";

export class CreateProviderDto {
        
    @IsString({ message: "El formato no es correcto" })
    name: string
    
    @IsOptional()
    @IsString({ message: "El formato no es correcto" })
    phone1?: string

    @IsOptional()
    @IsString({ message: "El formato no es correcto" })
    phone2?: string
    
    @IsOptional()
    @IsString({ message: "El formato no es correcto" })
    direction?: string
}
