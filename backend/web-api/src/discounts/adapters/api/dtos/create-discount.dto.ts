import { IsString, IsNumber, IsPositive, IsDateString } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  @IsPositive()
  readonly percentage: number;

  @IsString()
  readonly description: string;

  @IsDateString()
  readonly validFrom: string;

  @IsDateString()
  readonly validTo: string;
}
