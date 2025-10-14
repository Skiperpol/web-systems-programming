import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly address: string;

  @IsNumber()
  @IsPositive()
  readonly capacity: number;
}
