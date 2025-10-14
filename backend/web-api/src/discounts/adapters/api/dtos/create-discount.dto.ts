import { IsString, IsNumber, IsPositive, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountDto {
  @ApiProperty({
    description: 'Discount name',
    example: 'Summer Sale 2024',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Discount percentage (0-100)',
    example: 15,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsPositive()
  readonly percentage: number;

  @ApiProperty({
    description: 'Discount description',
    example: 'Special summer discount for all products',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Discount valid from date (ISO 8601)',
    example: '2024-06-01T00:00:00.000Z',
  })
  @IsDateString()
  readonly validFrom: string;

  @ApiProperty({
    description: 'Discount valid to date (ISO 8601)',
    example: '2024-08-31T23:59:59.999Z',
  })
  @IsDateString()
  readonly validTo: string;
}
