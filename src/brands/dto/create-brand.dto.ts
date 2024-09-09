import { IsOptional, IsString } from "class-validator";


export class CreateBrandDto {
    @IsString({ message: "El formato no es correcto" })
    nombre: string;

    @IsOptional()
    @IsString({ message: "Ingrese una descripcion correcta" })
    descripcion?: string;
}
