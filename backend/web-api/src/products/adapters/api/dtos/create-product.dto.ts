import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsString()
  readonly description: string;
}
